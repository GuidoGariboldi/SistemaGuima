import { ArrayNotEmpty, IsArray, IsInt, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CrearTipoEntradaDto {
  @IsString()
  @MinLength(2)
  nombre!: string;

  @IsNumber()
  @Min(0)
  precio!: number;

  @IsInt()
  @Min(1)
  cupo!: number;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  beneficios?: string[];
}
