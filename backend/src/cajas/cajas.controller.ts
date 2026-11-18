import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CajasService } from './cajas.service';
import { AbrirTurnoDto } from './dto/abrir-turno.dto';
import { CerrarTurnoDto } from './dto/cerrar-turno.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/decorators/current-user.decorator';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'caja')
export class CajasController {
  constructor(private readonly cajasService: CajasService) {}

  @Get('cajas')
  findAll() {
    return this.cajasService.findAll();
  }

  @Get('cajas/:id/turno-activo')
  turnoActivo(@Param('id') id: string) {
    return this.cajasService.turnoActivo(id);
  }

  @Post('cajas/:id/abrir-turno')
  abrirTurno(
    @Param('id') id: string,
    @Body() dto: AbrirTurnoDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.cajasService.abrirTurno(id, user.id, dto);
  }

  @Post('turnos/:id/cerrar')
  cerrarTurno(
    @Param('id') id: string,
    @Body() dto: CerrarTurnoDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.cajasService.cerrarTurno(id, user.id, dto);
  }
}
