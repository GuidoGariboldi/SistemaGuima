import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ItemVentaDto } from './item-venta.dto';

export class RegistrarVentaDto {
  @IsUUID()
  cajaId!: string;

  @IsUUID()
  turnoId!: string;

  @IsIn(['efectivo', 'mercadopago', 'tarjeta', 'transferencia', 'saldo'])
  medioPago!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ItemVentaDto)
  items!: ItemVentaDto[];

  @IsOptional()
  @IsString()
  cardUid?: string;
}
