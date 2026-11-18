import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { RutasService } from './rutas.service';
import { CrearRutaDto } from './dto/crear-ruta.dto';
import { ReservarRutaDto } from './dto/reservar-ruta.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { ParseUuidPipe } from '../common/pipes/parse-uuid.pipe';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/decorators/current-user.decorator';

@Controller()
export class RutasController {
  constructor(private readonly rutasService: RutasService) {}

  @Get('rutas')
  findAll(@Query() pagination: PaginationDto) {
    return this.rutasService.findAll(pagination);
  }

  @Get('rutas/:id')
  findOne(@Param('id', ParseUuidPipe) id: string) {
    return this.rutasService.findOne(id);
  }

  @Post('rutas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() dto: CrearRutaDto) {
    return this.rutasService.create(dto);
  }

  @Post('reservas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('socio')
  reservar(@Body() dto: ReservarRutaDto, @CurrentUser() user: AuthUser) {
    return this.rutasService.reservar(dto, user.id);
  }

  @Get('reservas/mias')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('socio')
  misReservas(@Query() pagination: PaginationDto, @CurrentUser() user: AuthUser) {
    return this.rutasService.misReservas(user.id, pagination);
  }
}
