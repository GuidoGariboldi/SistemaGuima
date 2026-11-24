import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CrearPreferenciaDto } from './dto/crear-preferencia.dto';
import { ConfirmarPagoDto } from './dto/confirmar-pago.dto';
import { VerificarPagoDto } from './dto/verificar-pago.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/decorators/current-user.decorator';

@Controller('pagos')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('socio')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Post('cargar-saldo')
  crearPreferencia(@Body() dto: CrearPreferenciaDto, @CurrentUser() user: AuthUser) {
    return this.pagosService.crearPreferencia(user.id, dto.monto);
  }

  @Post('confirmar')
  confirmarPago(@Body() dto: ConfirmarPagoDto, @CurrentUser() user: AuthUser) {
    return this.pagosService.confirmarPago(dto.paymentId, user.id);
  }

  @Post('verificar')
  verificarPago(@Body() dto: VerificarPagoDto, @CurrentUser() user: AuthUser) {
    return this.pagosService.verificarPago(dto.externalReference, user.id);
  }
}
