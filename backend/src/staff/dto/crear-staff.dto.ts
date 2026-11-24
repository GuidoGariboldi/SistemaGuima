import { IsEmail, IsIn, IsString, MinLength } from 'class-validator';

export class CrearStaffDto {
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

  @IsIn(['admin', 'caja', 'seguridad'])
  rol!: 'admin' | 'caja' | 'seguridad';
}
