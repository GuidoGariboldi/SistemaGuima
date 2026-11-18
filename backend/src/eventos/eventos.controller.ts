import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EventosService } from './eventos.service';
import { CrearEventoDto } from './dto/crear-evento.dto';
import { ActualizarEventoDto } from './dto/actualizar-evento.dto';
import { CrearTipoEntradaDto } from './dto/crear-tipo-entrada.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { ParseUuidPipe } from '../common/pipes/parse-uuid.pipe';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('eventos')
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.eventosService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id', ParseUuidPipe) id: string) {
    return this.eventosService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() dto: CrearEventoDto) {
    return this.eventosService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id', ParseUuidPipe) id: string, @Body() dto: ActualizarEventoDto) {
    return this.eventosService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id', ParseUuidPipe) id: string) {
    return this.eventosService.remove(id);
  }

  @Post(':id/tipos-entrada')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  crearTipoEntrada(@Param('id', ParseUuidPipe) id: string, @Body() dto: CrearTipoEntradaDto) {
    return this.eventosService.crearTipoEntrada(id, dto);
  }
}
