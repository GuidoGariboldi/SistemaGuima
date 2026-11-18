import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { EntradasService } from './entradas.service';
import { ComprarEntradaDto } from './dto/comprar-entrada.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/decorators/current-user.decorator';

@Controller('entradas')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('socio')
export class EntradasController {
  constructor(private readonly entradasService: EntradasService) {}

  @Post()
  comprar(@Body() dto: ComprarEntradaDto, @CurrentUser() user: AuthUser) {
    return this.entradasService.comprar(dto, user.id);
  }

  @Get('mias')
  misEntradas(@Query() pagination: PaginationDto, @CurrentUser() user: AuthUser) {
    return this.entradasService.misEntradas(user.id, pagination);
  }
}
