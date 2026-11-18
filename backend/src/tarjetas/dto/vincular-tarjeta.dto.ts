import { IsUUID } from 'class-validator';

export class VincularTarjetaDto {
  @IsUUID()
  socioId!: string;
}
