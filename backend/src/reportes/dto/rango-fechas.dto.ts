import { IsOptional, IsDateString } from 'class-validator';

export class RangoFechasDto {
  @IsOptional()
  @IsDateString()
  desde?: string;

  @IsOptional()
  @IsDateString()
  hasta?: string;
}
