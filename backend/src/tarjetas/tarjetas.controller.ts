import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TarjetasService } from './tarjetas.service';
import { CrearTarjetaDto } from './dto/crear-tarjeta.dto';
import { CargarSaldoDto } from './dto/cargar-saldo.dto';
import { VincularTarjetaDto } from './dto/vincular-tarjeta.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('tarjetas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TarjetasController {
  constructor(private readonly tarjetasService: TarjetasService) {}

  @Post()
  @Roles('admin')
  create(@Body() dto: CrearTarjetaDto) {
    return this.tarjetasService.create(dto);
  }

  @Get(':cardUid')
  @Roles('admin', 'caja')
  findOne(@Param('cardUid') cardUid: string) {
    return this.tarjetasService.findByCardUid(cardUid);
  }

  @Patch(':cardUid/vincular')
  @Roles('admin', 'caja', 'socio')
  vincular(@Param('cardUid') cardUid: string, @Body() dto: VincularTarjetaDto) {
    return this.tarjetasService.vincular(cardUid, dto);
  }

  @Post(':cardUid/cargar')
  @Roles('admin', 'caja')
  cargarSaldo(@Param('cardUid') cardUid: string, @Body() dto: CargarSaldoDto) {
    return this.tarjetasService.cargarSaldo(cardUid, dto);
  }

  @Get(':cardUid/movimientos')
  @Roles('admin', 'caja')
  movimientos(@Param('cardUid') cardUid: string, @Query() pagination: PaginationDto) {
    return this.tarjetasService.movimientos(cardUid, pagination);
  }
}
