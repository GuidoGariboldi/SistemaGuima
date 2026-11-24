import { ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.module';
import { RegistrarSocioDto } from './dto/registrar-socio.dto';
import { ActualizarPerfilDto } from './dto/actualizar-perfil.dto';
import { BloquearSocioDto } from './dto/bloquear-socio.dto';
import { LoginDto } from '../auth/dto/login.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class SociosService {
  constructor(
    @Inject(PG_POOL) private readonly pool: Pool,
    private readonly jwtService: JwtService,
  ) {}

  private sinPassword(socio: any) {
    const { password_hash, ...resto } = socio;
    return resto;
  }

  async registrar(dto: RegistrarSocioDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);

    let result;
    try {
      result = await this.pool.query(
        `INSERT INTO socios (nombre, apellido, email, password_hash, fecha_nac, dni)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, nombre, apellido, email, dni, member_number, nivel, puntos, created_at`,
        [dto.nombre, dto.apellido, dto.email, passwordHash, dto.fechaNac, dto.dni],
      );
    } catch (error: any) {
      if (error.code === '23505') {
        const campo = error.constraint?.includes('dni') ? 'DNI' : 'email';
        throw new ConflictException(`Ya existe una cuenta con ese ${campo}`);
      }
      throw error;
    }

    const socio = result.rows[0];
    const payload = { sub: socio.id, email: socio.email, rol: 'socio' as const };
    return { accessToken: this.jwtService.sign(payload), user: socio };
  }

  async login(dto: LoginDto) {
    const result = await this.pool.query(
      `SELECT id, nombre, apellido, email, password_hash, member_number, nivel, puntos
       FROM socios WHERE email = $1`,
      [dto.email],
    );
    if (result.rowCount === 0) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const socio = result.rows[0];
    const passwordValida = await bcrypt.compare(dto.password, socio.password_hash);
    if (!passwordValida) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const payload = { sub: socio.id, email: socio.email, rol: 'socio' as const };
    return { accessToken: this.jwtService.sign(payload), user: this.sinPassword(socio) };
  }

  async findAll(pagination: PaginationDto) {
    const result = await this.pool.query(
      `SELECT id, nombre, apellido, email, dni, bloqueado, motivo_bloqueo, bloqueado_hasta,
              member_number, nivel, puntos, created_at
       FROM socios
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [pagination.limit, pagination.offset],
    );
    return result.rows;
  }

  async findOne(id: string) {
    const result = await this.pool.query(
      `SELECT id, nombre, apellido, email, fecha_nac, dni, bloqueado, motivo_bloqueo, bloqueado_hasta,
              member_number, nivel, puntos, created_at
       FROM socios WHERE id = $1`,
      [id],
    );
    if (result.rowCount === 0) {
      throw new NotFoundException('Socio no encontrado');
    }
    return result.rows[0];
  }

  async actualizarPerfil(socioId: string, dto: ActualizarPerfilDto) {
    const campos: string[] = [];
    const valores: unknown[] = [];
    let i = 1;

    if (dto.nombre !== undefined) { campos.push(`nombre = $${i++}`); valores.push(dto.nombre); }
    if (dto.apellido !== undefined) { campos.push(`apellido = $${i++}`); valores.push(dto.apellido); }
    if (dto.dni !== undefined) { campos.push(`dni = $${i++}`); valores.push(dto.dni); }

    if (campos.length === 0) return this.findOne(socioId);

    valores.push(socioId);
    try {
      const result = await this.pool.query(
        `UPDATE socios SET ${campos.join(', ')} WHERE id = $${i}
         RETURNING id, nombre, apellido, email, fecha_nac, dni, member_number, nivel, puntos, created_at`,
        valores,
      );
      return result.rows[0];
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException('Ese DNI ya está registrado en otra cuenta');
      }
      throw error;
    }
  }

  // Control de acceso en la puerta: el patova escanea/tipea el DNI y acá
  // se resuelve todo lo que necesita ver de una — quién es, si está
  // bloqueado y si tiene entrada para el evento de esa noche.
  async buscarPorDni(dni: string, eventoId?: string) {
    const socio = await this.pool.query(
      `SELECT id, nombre, apellido, email, fecha_nac, dni, bloqueado, motivo_bloqueo, bloqueado_hasta
       FROM socios WHERE dni = $1`,
      [dni],
    );
    if (socio.rowCount === 0) {
      throw new NotFoundException('No hay ningún socio registrado con ese DNI');
    }
    const persona = socio.rows[0];

    let entrada = null;
    if (eventoId) {
      const result = await this.pool.query(
        `SELECT e.id, e.estado, e.used_at, e.created_at, te.nombre AS tipo_entrada_nombre
         FROM entradas e
         JOIN tipos_entrada te ON te.id = e.tipo_entrada_id
         WHERE e.socio_id = $1 AND e.evento_id = $2 AND e.estado != 'anulada'
         ORDER BY e.created_at DESC
         LIMIT 1`,
        [persona.id, eventoId],
      );
      entrada = result.rows[0] ?? null;
    }

    return { socio: persona, entrada };
  }

  async bloquear(socioId: string, dto: BloquearSocioDto) {
    await this.findOne(socioId);
    const result = await this.pool.query(
      `UPDATE socios SET bloqueado = true, motivo_bloqueo = $1, bloqueado_hasta = $2
       WHERE id = $3
       RETURNING id, nombre, apellido, email, bloqueado, motivo_bloqueo, bloqueado_hasta`,
      [dto.motivo, dto.hasta ?? null, socioId],
    );
    return result.rows[0];
  }

  async desbloquear(socioId: string) {
    await this.findOne(socioId);
    const result = await this.pool.query(
      `UPDATE socios SET bloqueado = false, motivo_bloqueo = null, bloqueado_hasta = null
       WHERE id = $1
       RETURNING id, nombre, apellido, email, bloqueado, motivo_bloqueo, bloqueado_hasta`,
      [socioId],
    );
    return result.rows[0];
  }
}
