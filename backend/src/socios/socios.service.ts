import { ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.module';
import { RegistrarSocioDto } from './dto/registrar-socio.dto';
import { LoginDto } from '../auth/dto/login.dto';

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
        `INSERT INTO socios (nombre, apellido, email, password_hash, fecha_nac)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, nombre, apellido, email, member_number, nivel, puntos, created_at`,
        [dto.nombre, dto.apellido, dto.email, passwordHash, dto.fechaNac],
      );
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException('Ya existe una cuenta con ese email');
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

  async findOne(id: string) {
    const result = await this.pool.query(
      `SELECT id, nombre, apellido, email, member_number, nivel, puntos, created_at
       FROM socios WHERE id = $1`,
      [id],
    );
    if (result.rowCount === 0) {
      throw new NotFoundException('Socio no encontrado');
    }
    return result.rows[0];
  }
}
