import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.module';
import { RegistrarVentaDto } from './dto/registrar-venta.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class VentasService {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async registrar(dto: RegistrarVentaDto, cajeroId: string) {
    if (dto.medioPago === 'saldo' && !dto.cardUid) {
      throw new BadRequestException('Pagar con saldo requiere el cardUid de la tarjeta');
    }

    const result = await this.pool.query(
      `SELECT fn_registrar_venta($1, $2, $3, $4, $5::jsonb, $6) AS venta_id`,
      [
        cajeroId,
        dto.cajaId,
        dto.turnoId,
        dto.medioPago,
        JSON.stringify(
          dto.items.map((item) => ({ producto_id: item.productoId, cantidad: item.cantidad })),
        ),
        dto.cardUid ?? null,
      ],
    );

    return this.findOne(result.rows[0].venta_id);
  }

  async findOne(id: string) {
    const venta = await this.pool.query(
      `SELECT id, caja_id, turno_id, cajero_id, medio_pago, total, estado, created_at
       FROM ventas WHERE id = $1`,
      [id],
    );
    if (venta.rowCount === 0) {
      throw new NotFoundException(`Venta ${id} no encontrada`);
    }

    const items = await this.pool.query(
      `SELECT producto_id, nombre, cantidad, precio_unit
       FROM venta_items WHERE venta_id = $1`,
      [id],
    );

    return {
      ...venta.rows[0],
      total: parseFloat(venta.rows[0].total),
      items: items.rows.map((item) => ({ ...item, precio_unit: parseFloat(item.precio_unit) })),
    };
  }

  async findAll(pagination: PaginationDto, turnoId?: string) {
    const condicion = turnoId ? 'WHERE turno_id = $3' : '';
    const params: unknown[] = [pagination.limit, pagination.offset];
    if (turnoId) params.push(turnoId);

    const result = await this.pool.query(
      `SELECT id, caja_id, turno_id, cajero_id, medio_pago, total, estado, created_at
       FROM ventas
       ${condicion}
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      params,
    );
    return result.rows.map((row) => ({ ...row, total: parseFloat(row.total) }));
  }
}
