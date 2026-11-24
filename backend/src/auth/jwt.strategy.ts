import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload{
    sub: string;
    email: string;
    rol: 'admin' | 'caja' | 'seguridad' | 'socio';
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(config: ConfigService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.getOrThrow<string>('JWT_SECRET'),

        });
    }

    validate(payload: JwtPayload){
        if(!payload.sub || !payload.rol){
            throw new UnauthorizedException();
        }
        return {id:payload.sub, email: payload.email, rol: payload.rol };
    }

    
}