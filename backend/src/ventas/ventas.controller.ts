import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { RegistrarVentaDto } from './dto/registrar-venta.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { ParseUuidPipe } from '../common/pipes/parse-uuid.pipe';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/decorators/current-user.decorator';

@Controller('ventas')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'caja')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post()
  registrar(@Body() dto: RegistrarVentaDto, @CurrentUser() user: AuthUser) {
    return this.ventasService.registrar(dto, user.id);
  }

  @Get()
  findAll(@Query() pagination: PaginationDto, @Query('turnoId') turnoId?: string) {
    return this.ventasService.findAll(pagination, turnoId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUuidPipe) id: string) {
    return this.ventasService.findOne(id);
  }
}
