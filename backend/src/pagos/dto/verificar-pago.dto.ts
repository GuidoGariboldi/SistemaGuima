import { IsString } from 'class-validator';

export class VerificarPagoDto {
  @IsString()
  externalReference!: string;
}
