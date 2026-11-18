import { IsInt, IsUUID, Min } from 'class-validator';

export class ItemVentaDto {
  @IsUUID()
  productoId!: string;

  @IsInt()
  @Min(1)
  cantidad!: number;
}
