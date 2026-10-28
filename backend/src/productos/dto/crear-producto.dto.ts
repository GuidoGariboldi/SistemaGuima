import { IsNumber,IsOptional,IsString,Min,MinLength } from "class-validator";

export class CrearProductoDto{
     @IsString()
     @MinLength(2)
     nombre! : string;

     @IsString()
     @MinLength(2)
     categoria! : string;

     @IsNumber()
     @Min(0)
     precio! : number;

     @IsOptional()
     @IsNumber()
     @Min(0)
     stock: number;

      @IsOptional()
    @IsNumber()
    @Min(0)
    costo?: number;


}