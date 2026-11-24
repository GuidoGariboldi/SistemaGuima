import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { GoogleUser } from './google.strategy';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // Dispara el redirect a la pantalla de consentimiento de Google. No hace
  // falta cuerpo acá: passport-google-oauth20 intercepta el request antes
  // de que corra el método.
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {}

  // Google vuelve acá después de que el usuario acepta. Emitimos nuestro
  // propio JWT (mismo formato que el login normal) y se lo pasamos al
  // frontend por query param, porque esto es un redirect de navegador, no
  // un fetch que podamos responder con JSON.
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const googleUser = req.user as GoogleUser;
    const result = await this.authService.loginConGoogle(googleUser);
    const frontendUrl = this.config.getOrThrow<string>('FRONTEND_URL');
    res.redirect(`${frontendUrl}/#/auth/google/callback?token=${result.accessToken}`);
  }
}