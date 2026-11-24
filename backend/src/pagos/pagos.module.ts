import { Module } from '@nestjs/common';
import { PagosController } from './pagos.controller';
import { PagosService } from './pagos.service';
import { TarjetasModule } from '../tarjetas/tarjetas.module';

@Module({
  imports: [TarjetasModule],
  controllers: [PagosController],
  providers: [PagosService],
})
export class PagosModule {}
