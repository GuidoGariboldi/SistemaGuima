import { IsIn, IsInt, IsNumber, IsOptional, IsString, IsUUID, Min, MinLength } from 'class-validator';

export class CrearRutaDto {
  @IsString()
  @MinLength(2)
  origen!: string;

  @IsOptional()
  @IsString()
  horaIda?: string;

  @IsOptional()
  @IsString()
  horaVuelta?: string;

  @IsNumber()
  @Min(0)
  precio!: number;

  @IsInt()
  @Min(1)
  asientos!: number;

  @IsIn(['Combi', 'Micro'])
  tipo!: string;

  @IsOptional()
  @IsUUID()
  eventoId?: string;
}
