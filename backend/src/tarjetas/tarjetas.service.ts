import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomInt } from 'crypto';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.module';
import { CrearTarjetaDto } from './dto/crear-tarjeta.dto';
import { CrearLoteDto } from './dto/crear-lote.dto';
import { CargarSaldoDto } from './dto/cargar-saldo.dto';
import { VincularTarjetaDto } from './dto/vincular-tarjeta.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Rol } from '../common/decorators/roles.decorator';

// Sin 0/O/1/I/L: se presta a confusión cuando alguien lee el código a mano
// de una tarjeta física o lo escribe en un formulario.
const CHARSET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

function generarCardUid() {
  let codigo = '';
  for (let i = 0; i < 6; i++) codigo += CHARSET[randomInt(CHARSET.length)];
  return `LB-${codigo}`;
}

@Injectable()
export class TarjetasService {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  private mapTarjeta(row: any) {
    return { ...row, saldo: parseFloat(row.saldo) };
  }

  async create(dto: CrearTarjetaDto) {
    const result = await this.pool.query(
      `INSERT INTO tarjetas (card_uid) VALUES ($1)
       RETURNING id, card_uid, socio_id, saldo, nivel, estado`,
      [dto.cardUid],
    );
    return this.mapTarjeta(result.rows[0]);
  }

  // Genera un lote de tarjetas sin asignar, listas para imprimir y después
  // vincular. Reintenta la generación del código si choca con uno
  // existente (con este alfabeto y largo, en la práctica casi nunca pasa).
  async crearLote(dto: CrearLoteDto) {
    const creadas: any[] = [];
    for (let i = 0; i < dto.cantidad; i++) {
      let insertado = false;
      while (!insertado) {
        try {
          const result = await this.pool.query(
            `INSERT INTO tarjetas (card_uid) VALUES ($1)
             RETURNING id, card_uid, socio_id, saldo, nivel, estado`,
            [generarCardUid()],
          );
          creadas.push(this.mapTarjeta(result.rows[0]));
          insertado = true;
        } catch (error: any) {
          if (error.code !== '23505') throw error;
        }
      }
    }
    return creadas;
  }

  async findAll(pagination: PaginationDto) {
    const result = await this.pool.query(
      `SELECT t.id, t.card_uid, t.socio_id, t.saldo, t.nivel, t.estado,
              s.nombre AS socio_nombre, s.apellido AS socio_apellido, s.email AS socio_email
       FROM tarjetas t
       LEFT JOIN socios s ON s.id = t.socio_id
       ORDER BY t.card_uid
       LIMIT $1 OFFSET $2`,
      [pagination.limit, pagination.offset],
    );
    return result.rows.map((row) => this.mapTarjeta(row));
  }

  async findByCardUid(cardUid: string) {
    const result = await this.pool.query(
      `SELECT t.id, t.card_uid, t.socio_id, t.saldo, t.nivel, t.estado,
              s.nombre AS socio_nombre, s.apellido AS socio_apellido, s.email AS socio_email
       FROM tarjetas t
       LEFT JOIN socios s ON s.id = t.socio_id
       WHERE t.card_uid = $1`,
      [cardUid],
    );
    if (result.rowCount === 0) {
      throw new NotFoundException(`Tarjeta ${cardUid} no encontrada`);
    }
    return this.mapTarjeta(result.rows[0]);
  }

  async findBySocio(socioId: string) {
    // 'perdida' queda afuera a propósito: una tarjeta dada de baja ya no
    // cuenta como "la tarjeta del socio" — tiene que vincular una nueva.
    const result = await this.pool.query(
      `SELECT id, card_uid, socio_id, saldo, nivel, estado
       FROM tarjetas WHERE socio_id = $1 AND estado IN ('activa', 'bloqueada')
       ORDER BY created_at DESC LIMIT 1`,
      [socioId],
    );
    if (result.rowCount === 0) {
      throw new NotFoundException('No tenés una tarjeta vinculada todavía');
    }
    return this.mapTarjeta(result.rows[0]);
  }

  async vincular(cardUid: string, dto: VincularTarjetaDto, requesterRol: Rol) {
    const tarjeta = await this.findByCardUid(cardUid);

    // Si ya está vinculada a otro socio, un socio no puede "robarla"
    // simplemente adivinando o escribiendo el código — solo lo puede
    // reasignar el staff (ej. tarjeta perdida, reemplazo).
    if (tarjeta.socio_id && tarjeta.socio_id !== dto.socioId && requesterRol === 'socio') {
      throw new ConflictException('Esta tarjeta ya está vinculada a otra cuenta');
    }

    const result = await this.pool.query(
      `UPDATE tarjetas SET socio_id = $1, estado = 'activa'
       WHERE card_uid = $2
       RETURNING id, card_uid, socio_id, saldo, nivel, estado`,
      [dto.socioId, cardUid],
    );
    return this.mapTarjeta(result.rows[0]);
  }

  // Pausa autogestionada: el socio puede revertirla él mismo con reactivar().
  async pausar(socioId: string) {
    const result = await this.pool.query(
      `UPDATE tarjetas SET estado = 'bloqueada'
       WHERE socio_id = $1 AND estado = 'activa'
       RETURNING id, card_uid, socio_id, saldo, nivel, estado`,
      [socioId],
    );
    if (result.rowCount === 0) {
      throw new NotFoundException('No tenés una tarjeta activa para pausar');
    }
    return this.mapTarjeta(result.rows[0]);
  }

  async reactivar(socioId: string) {
    const result = await this.pool.query(
      `UPDATE tarjetas SET estado = 'activa'
       WHERE socio_id = $1 AND estado = 'bloqueada'
       RETURNING id, card_uid, socio_id, saldo, nivel, estado`,
      [socioId],
    );
    if (result.rowCount === 0) {
      throw new NotFoundException('No tenés una tarjeta pausada para reactivar');
    }
    return this.mapTarjeta(result.rows[0]);
  }

  // A diferencia de pausar(), esto es definitivo para esa tarjeta física
  // (perdida/robada): el saldo queda congelado ahí y el socio tiene que
  // vincular una tarjeta nueva. No la desvinculamos del socio para que el
  // staff conserve el historial de a quién pertenecía.
  async reportarPerdida(socioId: string) {
    const result = await this.pool.query(
      `UPDATE tarjetas SET estado = 'perdida'
       WHERE socio_id = $1 AND estado IN ('activa', 'bloqueada')
       RETURNING id, card_uid, socio_id, saldo, nivel, estado`,
      [socioId],
    );
    if (result.rowCount === 0) {
      throw new NotFoundException('No tenés una tarjeta vinculada para dar de baja');
    }
    return this.mapTarjeta(result.rows[0]);
  }

  async misMovimientos(socioId: string, pagination: PaginationDto) {
    const tarjeta = await this.findBySocio(socioId);
    return this.movimientos(tarjeta.card_uid, pagination);
  }

  async cargarSaldo(cardUid: string, dto: CargarSaldoDto, cajeroId?: string) {
    try {
      const result = await this.pool.query(
        `SELECT * FROM fn_cargar_saldo($1, $2, $3, $4, $5, $6)`,
        [cardUid, dto.monto, dto.medioPago, dto.referenciaPago ?? null, dto.turnoId ?? null, cajeroId ?? null],
      );
      return this.mapTarjeta(result.rows[0]);
    } catch (error: any) {
      if (error.message?.includes('no existe')) {
        throw new NotFoundException(`Tarjeta ${cardUid} no encontrada`);
      }
      if (error.message?.includes('no está activa')) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  async movimientos(cardUid: string, pagination: PaginationDto) {
    const tarjeta = await this.findByCardUid(cardUid);
    const result = await this.pool.query(
      `SELECT id, tipo, monto, medio_pago, referencia_pago, created_at
       FROM movimientos_saldo
       WHERE tarjeta_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [tarjeta.id, pagination.limit, pagination.offset],
    );
    return result.rows.map((row) => ({ ...row, monto: parseFloat(row.monto) }));
  }
}
