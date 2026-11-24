import { IsNumber, Max, Min } from 'class-validator';

export class CrearPreferenciaDto {
  @IsNumber()
  @Min(1000)
  @Max(500000)
  monto!: number;
}
