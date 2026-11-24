import { IsInt, Max, Min } from 'class-validator';

export class CrearLoteDto {
  @IsInt()
  @Min(1)
  @Max(200)
  cantidad!: number;
}
