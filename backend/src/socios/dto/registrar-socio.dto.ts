import { IsDateString, IsEmail, IsString, MinLength } from 'class-validator';

export class RegistrarSocioDto {
  @IsString()
  @MinLength(2)
  nombre!: string;

  @IsString()
  @MinLength(2)
  apellido!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsDateString()
  fechaNac!: string;
}
