import { 
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query
 } from "@nestjs/common";
 import { ProductosService } from "./productos.service";
 import { CrearProductoDto } from "./dto/crear-producto.dto";
 import { ActualizarProductoDto } from "./dto/actualizar-producto.dto";
 import { PaginationDto } from "src/common/dtos/pagination.dto";
 import { ParseUuidPipe } from "src/common/pipes/parse-uuid.pipe";

 @Controller('productos')
 export class ProductosController{
    constructor(private readonly productosService: ProductosService){}

    @Get()
    findAll(@Query() pagination: PaginationDto){
        return this.productosService.findAll(pagination);
    }

    @Get(':id')
    findOne(@Param('id',ParseUuidPipe) id:string){
        return this.productosService.findOne(id);
    }

    @Post()
    create(@Body()dto:CrearProductoDto){
        return this.productosService.create(dto);
    }

    @Patch(':id')
    update(@Param('id', ParseUuidPipe)id : string, @Body()dto : ActualizarProductoDto){
        return this.productosService.update(id,dto);
    }
    
    @Delete(':id')
    remove(@Param('id', ParseUuidPipe) id: string) {
    return this.productosService.remove(id);
    }



 }