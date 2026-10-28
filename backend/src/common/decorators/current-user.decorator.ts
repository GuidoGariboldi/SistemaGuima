import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Rol } from './roles.decorator';

export interface AuthUser {
  id: string;
  email: string;
  rol: Rol;
}

// Uso: findAll(@CurrentUser() user: AuthUser) o @CurrentUser('id') id: string
export const CurrentUser = createParamDecorator(
  (data: keyof AuthUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: AuthUser | undefined = request.user;
    return data ? user?.[data] : user;
  },
);