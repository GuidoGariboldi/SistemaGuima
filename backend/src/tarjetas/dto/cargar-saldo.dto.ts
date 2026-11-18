import { IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CargarSaldoDto {
  @IsNumber()
  @Min(1000)
  monto!: number;

  @IsIn(['efectivo', 'mercadopago', 'tarjeta', 'transferencia'])
  medioPago!: string;

  @IsOptional()
  @IsString()
  referenciaPago?: string;
}
