import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.module';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService{
    constructor(
        @Inject(PG_POOL) private readonly pool: Pool,
        private readonly jwtService: JwtService,
    ){}

    async login(dto: LoginDto){
        const result = await this.pool.query(
            `SELECT id,email,password_hash, rol, activo FROM staff WHERE email=$1`,
            [dto.email],
        );
        if(result.rowCount === 0){
            throw new UnauthorizedException('Credenciales incorrectas');
        }

        const staff = result.rows[0];

        if(!staff.activo){
            throw new UnauthorizedException('Usuario Inactivo')
        }

        const passwordValida = await bcrypt.compare(dto.password, staff.password_hash);

        if(!passwordValida){
            throw new UnauthorizedException('Credenciales incorrectas');
        }
        const payload = { sub: staff.id, email: staff.email, rol: staff.rol };
        return {
            accessToken: this.jwtService.sign(payload),
            user: { id: staff.id, email: staff.email, rol: staff.rol },
        };
    }
 }
