import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.module';
import { ComprarEntradaDto } from './dto/comprar-entrada.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class EntradasService {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async comprar(dto: ComprarEntradaDto, socioId: string) {
    // La entrada queda asociada al DNI del socio (vía socio_id → socios.dni):
    // en la puerta se valida escaneando el DNI, así que sin DNI cargado no
    // hay forma de asociar ni de validar la entrada esa noche.
    const socio = await this.pool.query(`SELECT dni FROM socios WHERE id = $1`, [socioId]);
    if (!socio.rows[0]?.dni) {
      throw new BadRequestException('Completá tu DNI en tu perfil antes de comprar una entrada');
    }

    const tipo = await this.pool.query(
      `SELECT id, evento_id, nombre, precio, cupo, vendidas FROM tipos_entrada WHERE id = $1`,
      [dto.tipoEntradaId],
    );
    if (tipo.rowCount === 0) {
      throw new NotFoundException('Tipo de entrada no encontrado');
    }
    const { evento_id: eventoId, precio } = tipo.rows[0];

    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Pagar "con saldo" tiene que debitar la tarjeta de verdad, acá
      // mismo, en la misma transacción que crea la entrada — antes esto
      // insertaba la entrada y nunca tocaba la tarjeta, regalando entradas.
      let tarjetaId: string | null = null;
      if (dto.medioPago === 'saldo') {
        const tarjeta = await client.query(
          `SELECT id FROM tarjetas WHERE socio_id = $1 AND estado = 'activa' FOR UPDATE`,
          [socioId],
        );
        if (tarjeta.rowCount === 0) {
          throw new BadRequestException('No tenés una tarjeta activa para pagar con saldo');
        }
        tarjetaId = tarjeta.rows[0].id;
      }

      let entrada: any;
      try {
        const result = await client.query(
          `INSERT INTO entradas (socio_id, tipo_entrada_id, evento_id, precio, medio_pago)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, evento_id, tipo_entrada_id, precio, qr_code, estado, created_at`,
          [socioId, dto.tipoEntradaId, eventoId, precio, dto.medioPago],
        );
        entrada = result.rows[0];
      } catch (error: any) {
        if (error.message?.includes('Sin cupo')) {
          throw new BadRequestException('No quedan entradas disponibles de ese tipo');
        }
        throw error;
      }

      if (tarjetaId) {
        // El check saldo >= 0 de la tabla corta acá mismo si no alcanza.
        await client.query(`UPDATE tarjetas SET saldo = saldo - $1 WHERE id = $2`, [precio, tarjetaId]);
        await client.query(
          `INSERT INTO movimientos_saldo (tarjeta_id, tipo, monto, medio_pago)
           VALUES ($1, 'consumo', $2, 'saldo')`,
          [tarjetaId, precio],
        );
      }

      await client.query('COMMIT');
      return { ...entrada, precio: parseFloat(entrada.precio) };
    } catch (error: any) {
      await client.query('ROLLBACK');
      if (error.code === '23514' && error.constraint === 'tarjetas_saldo_check') {
        throw new BadRequestException('No tenés saldo suficiente para esta compra');
      }
      throw error;
    } finally {
      client.release();
    }
  }

  // Para el panel de admin: quién compró entradas de un evento puntual,
  // no solo "cuántas" (eso ya lo da /reportes/aforo-eventos).
  async porEvento(eventoId: string, pagination: PaginationDto) {
    const result = await this.pool.query(
      `SELECT e.id, e.precio, e.estado, e.medio_pago, e.created_at,
              te.nombre AS tipo_entrada_nombre,
              s.nombre AS socio_nombre, s.apellido AS socio_apellido, s.email AS socio_email
       FROM entradas e
       JOIN tipos_entrada te ON te.id = e.tipo_entrada_id
       JOIN socios s ON s.id = e.socio_id
       WHERE e.evento_id = $1
       ORDER BY e.created_at DESC
       LIMIT $2 OFFSET $3`,
      [eventoId, pagination.limit, pagination.offset],
    );
    return result.rows.map((row) => ({ ...row, precio: parseFloat(row.precio) }));
  }

  // El patova confirma el ingreso desde el control de acceso: queda
  // marcada como usada para que quede registro real de la asistencia.
  async marcarUsada(entradaId: string) {
    const result = await this.pool.query(
      `UPDATE entradas SET estado = 'usada', used_at = now()
       WHERE id = $1 AND estado = 'valida'
       RETURNING id, estado, used_at`,
      [entradaId],
    );
    if (result.rowCount === 0) {
      throw new NotFoundException('La entrada no existe o ya no está válida');
    }
    return result.rows[0];
  }

  async misEntradas(socioId: string, pagination: PaginationDto) {
    const result = await this.pool.query(
      `SELECT e.id, e.precio, e.qr_code, e.estado, e.created_at,
              ev.nombre AS evento_nombre, ev.fecha AS evento_fecha,
              te.nombre AS tipo_entrada_nombre
       FROM entradas e
       JOIN eventos ev ON ev.id = e.evento_id
       JOIN tipos_entrada te ON te.id = e.tipo_entrada_id
       WHERE e.socio_id = $1
       ORDER BY e.created_at DESC
       LIMIT $2 OFFSET $3`,
      [socioId, pagination.limit, pagination.offset],
    );
    return result.rows.map((row) => ({ ...row, precio: parseFloat(row.precio) }));
  }
}
