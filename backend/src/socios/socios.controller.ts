import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { SociosService } from './socios.service';
import { RegistrarSocioDto } from './dto/registrar-socio.dto';
import { ActualizarPerfilDto } from './dto/actualizar-perfil.dto';
import { BloquearSocioDto } from './dto/bloquear-socio.dto';
import { LoginDto } from '../auth/dto/login.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { ParseUuidPipe } from '../common/pipes/parse-uuid.pipe';
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

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll(@Query() pagination: PaginationDto) {
    return this.sociosService.findAll(pagination);
  }

  // Antes de ':id'-style routes no hace falta acá — 'me' y 'buscar-por-dni'
  // son prefijos literales distintos, Nest no los confunde entre sí.
  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('socio')
  me(@CurrentUser() user: AuthUser) {
    return this.sociosService.findOne(user.id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('socio')
  actualizarMiPerfil(@Body() dto: ActualizarPerfilDto, @CurrentUser() user: AuthUser) {
    return this.sociosService.actualizarPerfil(user.id, dto);
  }

  @Get('buscar-por-dni/:dni')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'caja', 'seguridad')
  buscarPorDni(@Param('dni') dni: string, @Query('eventoId') eventoId?: string) {
    return this.sociosService.buscarPorDni(dni, eventoId);
  }

  @Patch(':id/bloquear')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  bloquear(@Param('id', ParseUuidPipe) id: string, @Body() dto: BloquearSocioDto) {
    return this.sociosService.bloquear(id, dto);
  }

  @Patch(':id/desbloquear')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  desbloquear(@Param('id', ParseUuidPipe) id: string) {
    return this.sociosService.desbloquear(id);
  }
}
