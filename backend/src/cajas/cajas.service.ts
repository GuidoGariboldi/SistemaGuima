import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.module';
import { AbrirTurnoDto } from './dto/abrir-turno.dto';
import { CerrarTurnoDto } from './dto/cerrar-turno.dto';

const numericFields = [
  'fondo_inicial',
  'total_ventas',
  'total_efectivo',
  'total_mp',
  'total_tarjeta',
  'total_transferencia',
  'total_saldo',
  'efectivo_declarado',
  'diferencia',
];

@Injectable()
export class CajasService {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  private mapTurno(row: any) {
    const mapped = { ...row };
    for (const campo of numericFields) {
      if (mapped[campo] !== null && mapped[campo] !== undefined) {
        mapped[campo] = parseFloat(mapped[campo]);
      }
    }
    return mapped;
  }

  async findAll() {
    const result = await this.pool.query(
      `SELECT id, nombre, ubicacion, activa FROM cajas WHERE activa = true ORDER BY nombre`,
    );
    return result.rows;
  }

  async turnoActivo(cajaId: string) {
    const result = await this.pool.query(
      `SELECT * FROM turnos_caja WHERE caja_id = $1 AND estado = 'abierto'`,
      [cajaId],
    );
    if (result.rowCount === 0) {
      throw new NotFoundException('No hay un turno abierto para esta caja');
    }
    return this.mapTurno(result.rows[0]);
  }

  async abrirTurno(cajaId: string, cajeroId: string, dto: AbrirTurnoDto) {
    const result = await this.pool.query(`SELECT * FROM fn_abrir_turno($1, $2, $3)`, [
      cajaId,
      cajeroId,
      dto.fondoInicial,
    ]);
    return this.mapTurno(result.rows[0]);
  }

  async cerrarTurno(turnoId: string, cajeroId: string, dto: CerrarTurnoDto) {
    const result = await this.pool.query(`SELECT * FROM fn_cerrar_turno($1, $2, $3)`, [
      turnoId,
      cajeroId,
      dto.efectivoDeclarado,
    ]);
    return this.mapTurno(result.rows[0]);
  }
}
