import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { RangoFechasDto } from './dto/rango-fechas.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('reportes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Get('cierres-caja')
  cierresCaja(@Query() dto: RangoFechasDto) {
    return this.reportesService.cierresCaja(dto);
  }

  @Get('ventas-por-medio-pago')
  ventasPorMedioPago(@Query() dto: RangoFechasDto) {
    return this.reportesService.ventasPorMedioPago(dto);
  }

  @Get('ranking-productos')
  rankingProductos(@Query('limite') limite?: string) {
    return this.reportesService.rankingProductos(limite ? parseInt(limite, 10) : 10);
  }

  @Get('aforo-eventos')
  aforoEventos() {
    return this.reportesService.aforoEventos();
  }

  @Get('saldo-tarjetas')
  saldoTarjetas() {
    return this.reportesService.saldoTotalTarjetas();
  }

  @Get('ocupacion-rutas')
  ocupacionRutas() {
    return this.reportesService.ocupacionRutas();
  }
}
