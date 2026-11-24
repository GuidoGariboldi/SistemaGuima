import { IsString } from 'class-validator';

export class ConfirmarPagoDto {
  @IsString()
  paymentId!: string;
}
