import { Module } from '@nestjs/common';
import { EventosController } from './eventos.controller';
import { EventosService } from './eventos.service';
import { EntradasController } from './entradas.controller';
import { EntradasService } from './entradas.service';

@Module({
  controllers: [EventosController, EntradasController],
  providers: [EventosService, EntradasService],
})
export class EventosModule {}
