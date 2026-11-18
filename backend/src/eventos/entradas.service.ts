import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.module';
import { ComprarEntradaDto } from './dto/comprar-entrada.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class EntradasService {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async comprar(dto: ComprarEntradaDto, socioId: string) {
    const tipo = await this.pool.query(
      `SELECT id, evento_id, nombre, precio, cupo, vendidas FROM tipos_entrada WHERE id = $1`,
      [dto.tipoEntradaId],
    );
    if (tipo.rowCount === 0) {
      throw new NotFoundException('Tipo de entrada no encontrado');
    }
    const { evento_id: eventoId, precio } = tipo.rows[0];

    try {
      const result = await this.pool.query(
        `INSERT INTO entradas (socio_id, tipo_entrada_id, evento_id, precio, medio_pago)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, evento_id, tipo_entrada_id, precio, qr_code, estado, created_at`,
        [socioId, dto.tipoEntradaId, eventoId, precio, dto.medioPago],
      );
      return { ...result.rows[0], precio: parseFloat(result.rows[0].precio) };
    } catch (error: any) {
      if (error.message?.includes('Sin cupo')) {
        throw new BadRequestException('No quedan entradas disponibles de ese tipo');
      }
      throw error;
    }
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
