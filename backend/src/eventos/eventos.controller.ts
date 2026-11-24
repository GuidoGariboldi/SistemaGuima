import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { mkdirSync } from 'fs';
import type { Request } from 'express';
import { EventosService } from './eventos.service';
import { CrearEventoDto } from './dto/crear-evento.dto';
import { ActualizarEventoDto } from './dto/actualizar-evento.dto';
import { CrearTipoEntradaDto } from './dto/crear-tipo-entrada.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { ParseUuidPipe } from '../common/pipes/parse-uuid.pipe';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

const UPLOADS_DIR = join(process.cwd(), 'uploads', 'eventos');
const TIPOS_PERMITIDOS = ['image/png', 'image/jpeg'];

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

  // Devuelve la URL pública de la imagen ya subida, para que el form de
  // "Crear evento" la mande como imagenUrl junto con el resto de los datos.
  @Post('upload-imagen')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          mkdirSync(UPLOADS_DIR, { recursive: true });
          cb(null, UPLOADS_DIR);
        },
        filename: (_req, file, cb) => cb(null, `${randomUUID()}${extname(file.originalname)}`),
      }),
      fileFilter: (_req, file, cb) => {
        if (!TIPOS_PERMITIDOS.includes(file.mimetype)) {
          return cb(new BadRequestException('Solo se permiten imágenes PNG o JPEG'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  uploadImagen(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    if (!file) {
      throw new BadRequestException('Falta el archivo de imagen');
    }
    return { imagenUrl: `${req.protocol}://${req.get('host')}/uploads/eventos/${file.filename}` };
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
