import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.module';
import { CrearEventoDto } from './dto/crear-evento.dto';
import { ActualizarEventoDto } from './dto/actualizar-evento.dto';
import { CrearTipoEntradaDto } from './dto/crear-tipo-entrada.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

const columnaPorCampo: Record<string, string> = {
  nombre: 'nombre',
  dj: 'dj',
  fecha: 'fecha',
  hora: 'hora',
  categoria: 'categoria',
  imagenUrl: 'imagen_url',
  destacado: 'destacado',
};

@Injectable()
export class EventosService {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  private mapTipoEntrada(row: any) {
    return { ...row, precio: parseFloat(row.precio) };
  }

  async findAll(pagination: PaginationDto) {
    const result = await this.pool.query(
      `SELECT id, nombre, dj, fecha, hora, categoria, imagen_url, destacado
       FROM eventos
       WHERE activo = true
       ORDER BY fecha ASC
       LIMIT $1 OFFSET $2`,
      [pagination.limit, pagination.offset],
    );
    return result.rows;
  }

  async findOne(id: string) {
    const evento = await this.pool.query(
      `SELECT id, nombre, dj, fecha, hora, categoria, imagen_url, destacado
       FROM eventos WHERE id = $1`,
      [id],
    );
    if (evento.rowCount === 0) {
      throw new NotFoundException(`Evento ${id} no encontrado`);
    }

    const tipos = await this.pool.query(
      `SELECT id, nombre, precio, cupo, vendidas, beneficios
       FROM tipos_entrada WHERE evento_id = $1`,
      [id],
    );

    return {
      ...evento.rows[0],
      tiposEntrada: tipos.rows.map((row) => this.mapTipoEntrada(row)),
    };
  }

  async create(dto: CrearEventoDto) {
    const result = await this.pool.query(
      `INSERT INTO eventos (nombre, dj, fecha, hora, categoria, imagen_url, destacado)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, nombre, dj, fecha, hora, categoria, imagen_url, destacado`,
      [
        dto.nombre,
        dto.dj ?? null,
        dto.fecha,
        dto.hora ?? null,
        dto.categoria ?? null,
        dto.imagenUrl ?? null,
        dto.destacado ?? false,
      ],
    );
    return result.rows[0];
  }

  async update(id: string, dto: ActualizarEventoDto) {
    await this.findOne(id);

    const campos: string[] = [];
    const valores: unknown[] = [];
    let i = 1;

    for (const [clave, valor] of Object.entries(dto)) {
      if (valor === undefined) continue;
      const columna = columnaPorCampo[clave];
      if (!columna) continue;
      campos.push(`${columna} = $${i}`);
      valores.push(valor);
      i++;
    }

    if (campos.length === 0) return this.findOne(id);

    valores.push(id);
    const result = await this.pool.query(
      `UPDATE eventos SET ${campos.join(', ')}
       WHERE id = $${i}
       RETURNING id, nombre, dj, fecha, hora, categoria, imagen_url, destacado`,
      valores,
    );
    return result.rows[0];
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.pool.query('UPDATE eventos SET activo = false WHERE id = $1', [id]);
    return { ok: true };
  }

  async crearTipoEntrada(eventoId: string, dto: CrearTipoEntradaDto) {
    await this.findOne(eventoId);
    const result = await this.pool.query(
      `INSERT INTO tipos_entrada (evento_id, nombre, precio, cupo, beneficios)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nombre, precio, cupo, vendidas, beneficios`,
      [eventoId, dto.nombre, dto.precio, dto.cupo, dto.beneficios ?? null],
    );
    return this.mapTipoEntrada(result.rows[0]);
  }
}
