import { IsDateString, IsEmail, IsString, Matches, MinLength } from 'class-validator';

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

  // DNI argentino: 7 u 8 dígitos, sin puntos.
  @Matches(/^\d{7,8}$/, { message: 'El DNI debe tener 7 u 8 dígitos, sin puntos' })
  dni!: string;
}
