import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { EntradasService } from './entradas.service';
import { ComprarEntradaDto } from './dto/comprar-entrada.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { ParseUuidPipe } from '../common/pipes/parse-uuid.pipe';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/decorators/current-user.decorator';

@Controller('entradas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EntradasController {
  constructor(private readonly entradasService: EntradasService) {}

  @Post()
  @Roles('socio')
  comprar(@Body() dto: ComprarEntradaDto, @CurrentUser() user: AuthUser) {
    return this.entradasService.comprar(dto, user.id);
  }

  @Get('mias')
  @Roles('socio')
  misEntradas(@Query() pagination: PaginationDto, @CurrentUser() user: AuthUser) {
    return this.entradasService.misEntradas(user.id, pagination);
  }

  // Antes de ':eventoId' no hace falta acá porque 'mias' y 'evento' son
  // literales distintos — no hay colisión de patrones.
  @Get('evento/:eventoId')
  @Roles('admin', 'caja')
  porEvento(@Param('eventoId', ParseUuidPipe) eventoId: string, @Query() pagination: PaginationDto) {
    return this.entradasService.porEvento(eventoId, pagination);
  }

  @Patch(':id/usar')
  @Roles('admin', 'caja', 'seguridad')
  marcarUsada(@Param('id', ParseUuidPipe) id: string) {
    return this.entradasService.marcarUsada(id);
  }
}
