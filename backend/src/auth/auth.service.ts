import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.module';
import { LoginDto } from './dto/login.dto';
import { GoogleUser } from './google.strategy';

@Injectable()
export class AuthService {
  constructor(
    @Inject(PG_POOL) private readonly pool: Pool,
    private readonly jwtService: JwtService,
  ) {}

  // Login único para toda la app: la misma pantalla sirve para socios y
  // para staff (admin/caja). Primero busca en staff; si ese email no
  // existe ahí, prueba en socios. El frontend decide a dónde navegar
  // mirando el "rol" que viene en la respuesta.
  async login(dto: LoginDto) {
    const staffResult = await this.pool.query(
      `SELECT id, email, password_hash, rol, activo FROM staff WHERE email = $1`,
      [dto.email],
    );

    if (staffResult.rowCount! > 0) {
      const staff = staffResult.rows[0];
      if (!staff.activo) {
        throw new UnauthorizedException('Usuario inactivo');
      }
      const passwordValida = await bcrypt.compare(dto.password, staff.password_hash);
      if (!passwordValida) {
        throw new UnauthorizedException('Credenciales incorrectas');
      }
      return this.firmar(staff.id, staff.email, staff.rol);
    }

    const socioResult = await this.pool.query(
      `SELECT id, email, password_hash FROM socios WHERE email = $1`,
      [dto.email],
    );

    if (socioResult.rowCount! > 0) {
      const socio = socioResult.rows[0];
      const passwordValida = await bcrypt.compare(dto.password, socio.password_hash);
      if (!passwordValida) {
        throw new UnauthorizedException('Credenciales incorrectas');
      }
      return this.firmar(socio.id, socio.email, 'socio');
    }

    throw new UnauthorizedException('Credenciales incorrectas');
  }

  // Login/registro automático con Google: si ya existe un socio con ese
  // email lo logueamos (y le linkeamos el google_id si todavía no lo tenía,
  // por si se había registrado antes con email/contraseña); si no existe,
  // lo creamos en el momento sin pedirle contraseña ni fecha de nacimiento.
  async loginConGoogle(googleUser: GoogleUser) {
    if (!googleUser.email) {
      throw new UnauthorizedException('Tu cuenta de Google no tiene un email disponible');
    }

    const existente = await this.pool.query(
      `SELECT id, email, google_id FROM socios WHERE email = $1`,
      [googleUser.email],
    );

    if (existente.rowCount! > 0) {
      const socio = existente.rows[0];
      if (!socio.google_id) {
        await this.pool.query(`UPDATE socios SET google_id = $1 WHERE id = $2`, [
          googleUser.googleId,
          socio.id,
        ]);
      }
      return this.firmar(socio.id, socio.email, 'socio');
    }

    const creado = await this.pool.query(
      `INSERT INTO socios (nombre, apellido, email, google_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email`,
      [googleUser.nombre, googleUser.apellido, googleUser.email, googleUser.googleId],
    );
    const socio = creado.rows[0];
    return this.firmar(socio.id, socio.email, 'socio');
  }

  private firmar(id: string, email: string, rol: 'admin' | 'caja' | 'seguridad' | 'socio') {
    const payload = { sub: id, email, rol };
    return {
      accessToken: this.jwtService.sign(payload),
      user: { id, email, rol },
    };
  }
}
