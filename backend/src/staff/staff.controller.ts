import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { StaffService } from './staff.service';
import { CrearStaffDto } from './dto/crear-staff.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ParseUuidPipe } from '../common/pipes/parse-uuid.pipe';

// Gestión de cuentas de staff (admin, caja, seguridad) — solo un admin
// puede crear o dar de baja estas cuentas.
@Controller('staff')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  create(@Body() dto: CrearStaffDto) {
    return this.staffService.create(dto);
  }

  @Get()
  findAll() {
    return this.staffService.findAll();
  }

  @Patch(':id/activo')
  setActivo(@Param('id', ParseUuidPipe) id: string, @Body('activo') activo: boolean) {
    return this.staffService.setActivo(id, activo);
  }
}
