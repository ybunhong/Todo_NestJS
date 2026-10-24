import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC } from './decorators/public.decorator.js';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private r: Reflector) {
    super();
  }

  canActivate(ctx: ExecutionContext) {
    const isPublic = this.r.getAllAndOverride(IS_PUBLIC, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    return isPublic || super.canActivate(ctx);
  }
}
