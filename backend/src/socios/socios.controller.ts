import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { SociosService } from './socios.service';
import { RegistrarSocioDto } from './dto/registrar-socio.dto';
import { LoginDto } from '../auth/dto/login.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/decorators/current-user.decorator';

@Controller('socios')
export class SociosController {
  constructor(private readonly sociosService: SociosService) {}

  @Post('registro')
  registrar(@Body() dto: RegistrarSocioDto) {
    return this.sociosService.registrar(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.sociosService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('socio')
  me(@CurrentUser() user: AuthUser) {
    return this.sociosService.findOne(user.id);
  }
}
