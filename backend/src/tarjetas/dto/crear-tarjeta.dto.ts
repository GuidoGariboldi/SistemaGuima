import { IsString, MinLength } from 'class-validator';

export class CrearTarjetaDto {
  @IsString()
  @MinLength(4)
  cardUid!: string;
}
