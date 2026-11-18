import { IsNumber, Min } from 'class-validator';

export class AbrirTurnoDto {
  @IsNumber()
  @Min(0)
  fondoInicial!: number;
}
