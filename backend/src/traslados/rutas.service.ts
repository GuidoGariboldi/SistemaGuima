import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.module';
import { CrearRutaDto } from './dto/crear-ruta.dto';
import { ReservarRutaDto } from './dto/reservar-ruta.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class RutasService {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  private mapRuta(row: any) {
    return { ...row, precio: parseFloat(row.precio) };
  }

  async findAll(pagination: PaginationDto) {
    const result = await this.pool.query(
      `SELECT id, origen, destino, hora_ida, hora_vuelta, precio, asientos, disponibles, tipo
       FROM rutas WHERE activo = true
       ORDER BY origen
       LIMIT $1 OFFSET $2`,
      [pagination.limit, pagination.offset],
    );
    return result.rows.map((row) => this.mapRuta(row));
  }

  async findOne(id: string) {
    const result = await this.pool.query(
      `SELECT id, origen, destino, hora_ida, hora_vuelta, precio, asientos, disponibles, tipo
       FROM rutas WHERE id = $1`,
      [id],
    );
    if (result.rowCount === 0) {
      throw new NotFoundException(`Ruta ${id} no encontrada`);
    }
    return this.mapRuta(result.rows[0]);
  }

  async create(dto: CrearRutaDto) {
    const result = await this.pool.query(
      `INSERT INTO rutas (origen, hora_ida, hora_vuelta, precio, asientos, disponibles, tipo, evento_id)
       VALUES ($1, $2, $3, $4, $5, $5, $6, $7)
       RETURNING id, origen, destino, hora_ida, hora_vuelta, precio, asientos, disponibles, tipo`,
      [
        dto.origen,
        dto.horaIda ?? null,
        dto.horaVuelta ?? null,
        dto.precio,
        dto.asientos,
        dto.tipo,
        dto.eventoId ?? null,
      ],
    );
    return this.mapRuta(result.rows[0]);
  }

  async reservar(dto: ReservarRutaDto, socioId: string) {
    const ruta = await this.findOne(dto.rutaId);
    const precioTotal = ruta.precio * dto.asientos;

    try {
      const result = await this.pool.query(
        `INSERT INTO reservas_traslado (socio_id, ruta_id, asientos, precio)
         VALUES ($1, $2, $3, $4)
         RETURNING id, ruta_id, asientos, precio, estado, created_at`,
        [socioId, dto.rutaId, dto.asientos, precioTotal],
      );
      return { ...result.rows[0], precio: parseFloat(result.rows[0].precio) };
    } catch (error: any) {
      if (error.message?.includes('No hay suficientes asientos')) {
        throw new BadRequestException('No hay suficientes asientos disponibles');
      }
      throw error;
    }
  }

  async misReservas(socioId: string, pagination: PaginationDto) {
    const result = await this.pool.query(
      `SELECT r.id, r.asientos, r.precio, r.estado, r.created_at,
              ru.origen, ru.destino, ru.hora_ida
       FROM reservas_traslado r
       JOIN rutas ru ON ru.id = r.ruta_id
       WHERE r.socio_id = $1
       ORDER BY r.created_at DESC
       LIMIT $2 OFFSET $3`,
      [socioId, pagination.limit, pagination.offset],
    );
    return result.rows.map((row) => ({ ...row, precio: parseFloat(row.precio) }));
  }
}
