import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TarjetasService } from './tarjetas.service';
import { CrearTarjetaDto } from './dto/crear-tarjeta.dto';
import { CrearLoteDto } from './dto/crear-lote.dto';
import { CargarSaldoDto } from './dto/cargar-saldo.dto';
import { VincularTarjetaDto } from './dto/vincular-tarjeta.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/decorators/current-user.decorator';

@Controller('tarjetas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TarjetasController {
  constructor(private readonly tarjetasService: TarjetasService) {}

  @Post()
  @Roles('admin')
  create(@Body() dto: CrearTarjetaDto) {
    return this.tarjetasService.create(dto);
  }

  @Post('lote')
  @Roles('admin')
  crearLote(@Body() dto: CrearLoteDto) {
    return this.tarjetasService.crearLote(dto);
  }

  // Van antes de ':cardUid' a propósito: si no, Nest interpretaría "mia" o
  // "lote" como si fueran un card_uid literal, porque las rutas se
  // matchean en orden.
  @Get('mia')
  @Roles('socio')
  miTarjeta(@CurrentUser() user: AuthUser) {
    return this.tarjetasService.findBySocio(user.id);
  }

  @Get('mia/movimientos')
  @Roles('socio')
  misMovimientos(@Query() pagination: PaginationDto, @CurrentUser() user: AuthUser) {
    return this.tarjetasService.misMovimientos(user.id, pagination);
  }

  @Patch('mia/pausar')
  @Roles('socio')
  pausarMiTarjeta(@CurrentUser() user: AuthUser) {
    return this.tarjetasService.pausar(user.id);
  }

  @Patch('mia/reactivar')
  @Roles('socio')
  reactivarMiTarjeta(@CurrentUser() user: AuthUser) {
    return this.tarjetasService.reactivar(user.id);
  }

  @Patch('mia/reportar-perdida')
  @Roles('socio')
  reportarPerdida(@CurrentUser() user: AuthUser) {
    return this.tarjetasService.reportarPerdida(user.id);
  }

  @Get()
  @Roles('admin', 'caja')
  findAll(@Query() pagination: PaginationDto) {
    return this.tarjetasService.findAll(pagination);
  }

  @Get(':cardUid')
  @Roles('admin', 'caja')
  findOne(@Param('cardUid') cardUid: string) {
    return this.tarjetasService.findByCardUid(cardUid);
  }

  @Patch(':cardUid/vincular')
  @Roles('admin', 'caja', 'socio')
  vincular(
    @Param('cardUid') cardUid: string,
    @Body() dto: VincularTarjetaDto,
    @CurrentUser() user: AuthUser,
  ) {
    // Un socio solo puede vincularse a sí mismo, sin importar qué socioId
    // mande en el body — evitamos que alguien vincule la tarjeta de otro.
    const socioId = user.rol === 'socio' ? user.id : dto.socioId;
    if (!socioId) {
      throw new BadRequestException('Falta indicar a qué socio vincular la tarjeta');
    }
    return this.tarjetasService.vincular(cardUid, { socioId }, user.rol);
  }

  @Post(':cardUid/cargar')
  @Roles('admin', 'caja')
  cargarSaldo(@Param('cardUid') cardUid: string, @Body() dto: CargarSaldoDto, @CurrentUser() user: AuthUser) {
    return this.tarjetasService.cargarSaldo(cardUid, dto, user.id);
  }

  @Get(':cardUid/movimientos')
  @Roles('admin', 'caja')
  movimientos(@Param('cardUid') cardUid: string, @Query() pagination: PaginationDto) {
    return this.tarjetasService.movimientos(cardUid, pagination);
  }
}
