import { IsDateString, IsOptional, IsString, MinLength } from 'class-validator';

export class BloquearSocioDto {
  @IsString()
  @MinLength(3)
  motivo!: string;

  // Fecha hasta la que dura el bloqueo. Si no se manda, queda indefinido
  // hasta que un admin lo levante a mano.
  @IsOptional()
  @IsDateString()
  hasta?: string;
}
