import { IsIn, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CargarSaldoDto {
  @IsNumber()
  @Min(1000)
  monto!: number;

  @IsIn(['efectivo', 'mercadopago', 'tarjeta', 'transferencia'])
  medioPago!: string;

  @IsOptional()
  @IsString()
  referenciaPago?: string;

  // Si la carga la hace un cajero con el turno abierto, esto permite que el
  // cierre de caja (fn_cerrar_turno) sepa cuánto efectivo entró de verdad
  // por cargas — las ventas en sí ya no se cobran en efectivo.
  @IsOptional()
  @IsUUID()
  turnoId?: string;
}
