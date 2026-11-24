import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { DatabaseModule } from './database/database.module';
import { ProductosModule } from './productos/productos.module';
import { AuthModule } from './auth/auth.module';
import { TarjetasModule } from './tarjetas/tarjetas.module';
import { CajasModule } from './cajas/cajas.module';
import { VentasModule } from './ventas/ventas.module';
import { SociosModule } from './socios/socios.module';
import { EventosModule } from './eventos/eventos.module';
import { TrasladosModule } from './traslados/traslados.module';
import { ReportesModule } from './reportes/reportes.module';
import { PagosModule } from './pagos/pagos.module';
import { StaffModule } from './staff/staff.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    CommonModule,
    AuthModule,
    ProductosModule,
    TarjetasModule,
    CajasModule,
    VentasModule,
    SociosModule,
    EventosModule,
    TrasladosModule,
    ReportesModule,
    PagosModule,
    StaffModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}