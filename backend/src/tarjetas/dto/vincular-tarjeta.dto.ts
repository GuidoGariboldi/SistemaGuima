import { IsOptional, IsUUID } from 'class-validator';

export class VincularTarjetaDto {
  // Opcional porque cuando lo pide un socio, el backend ignora este campo
  // y usa el id del propio usuario autenticado (ver TarjetasController.vincular).
  @IsOptional()
  @IsUUID()
  socioId?: string;
}
