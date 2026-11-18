import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.module';
import { CrearTarjetaDto } from './dto/crear-tarjeta.dto';
import { CargarSaldoDto } from './dto/cargar-saldo.dto';
import { VincularTarjetaDto } from './dto/vincular-tarjeta.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

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

  async findByCardUid(cardUid: string) {
    const result = await this.pool.query(
      `SELECT id, card_uid, socio_id, saldo, nivel, estado
       FROM tarjetas WHERE card_uid = $1`,
      [cardUid],
    );
    if (result.rowCount === 0) {
      throw new NotFoundException(`Tarjeta ${cardUid} no encontrada`);
    }
    return this.mapTarjeta(result.rows[0]);
  }

  async findBySocio(socioId: string) {
    const result = await this.pool.query(
      `SELECT id, card_uid, socio_id, saldo, nivel, estado
       FROM tarjetas WHERE socio_id = $1`,
      [socioId],
    );
    if (result.rowCount === 0) {
      throw new NotFoundException('No tenés una tarjeta vinculada todavía');
    }
    return this.mapTarjeta(result.rows[0]);
  }

  async vincular(cardUid: string, dto: VincularTarjetaDto) {
    await this.findByCardUid(cardUid);
    const result = await this.pool.query(
      `UPDATE tarjetas SET socio_id = $1, estado = 'activa'
       WHERE card_uid = $2
       RETURNING id, card_uid, socio_id, saldo, nivel, estado`,
      [dto.socioId, cardUid],
    );
    return this.mapTarjeta(result.rows[0]);
  }

  async cargarSaldo(cardUid: string, dto: CargarSaldoDto) {
    const result = await this.pool.query(
      `SELECT * FROM fn_cargar_saldo($1, $2, $3, $4)`,
      [cardUid, dto.monto, dto.medioPago, dto.referenciaPago ?? null],
    );
    if (result.rowCount === 0) {
      throw new NotFoundException(`Tarjeta ${cardUid} no encontrada`);
    }
    return this.mapTarjeta(result.rows[0]);
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
