import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

// Coincide con staff.rol ('admin' | 'caja' | 'seguridad') + 'socio' para endpoints de usuarios finales
export type Rol = 'admin' | 'caja' | 'seguridad' | 'socio';

// Uso: @Roles('admin') en un controller o método, junto a @UseGuards(JwtAuthGuard, RolesGuard)
export const Roles = (...roles: Rol[]) => SetMetadata(ROLES_KEY, roles);