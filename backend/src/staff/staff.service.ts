import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.module';
import { CrearStaffDto } from './dto/crear-staff.dto';

@Injectable()
export class StaffService {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async create(dto: CrearStaffDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    try {
      const result = await this.pool.query(
        `INSERT INTO staff (nombre, apellido, email, password_hash, rol)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, nombre, apellido, email, rol, activo, created_at`,
        [dto.nombre, dto.apellido, dto.email, passwordHash, dto.rol],
      );
      return result.rows[0];
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException('Ya existe una cuenta de staff con ese email');
      }
      throw error;
    }
  }

  async findAll() {
    const result = await this.pool.query(
      `SELECT id, nombre, apellido, email, rol, activo, created_at
       FROM staff ORDER BY created_at DESC`,
    );
    return result.rows;
  }

  async setActivo(id: string, activo: boolean) {
    const result = await this.pool.query(
      `UPDATE staff SET activo = $1 WHERE id = $2
       RETURNING id, nombre, apellido, email, rol, activo, created_at`,
      [activo, id],
    );
    if (result.rowCount === 0) {
      throw new NotFoundException('Cuenta de staff no encontrada');
    }
    return result.rows[0];
  }
}
