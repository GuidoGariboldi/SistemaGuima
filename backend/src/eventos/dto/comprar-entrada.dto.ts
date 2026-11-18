import { IsIn, IsUUID } from 'class-validator';

export class ComprarEntradaDto {
  @IsUUID()
  tipoEntradaId!: string;

  @IsIn(['efectivo', 'mercadopago', 'tarjeta', 'transferencia', 'saldo'])
  medioPago!: string;
}
