import { Module } from '@nestjs/common';
import { SociosController } from './socios.controller';
import { SociosService } from './socios.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [SociosController],
  providers: [SociosService],
})
export class SociosModule {}
