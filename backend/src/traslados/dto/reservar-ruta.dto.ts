import { IsInt, IsUUID, Min } from 'class-validator';

export class ReservarRutaDto {
  @IsUUID()
  rutaId!: string;

  @IsInt()
  @Min(1)
  asientos!: number;
}
