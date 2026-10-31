import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { Public } from '@/auth/decorators/public.decorator.js';
import { CurrentUser } from '@/auth/decorators/current-user.decorator.js';
import { RegisterDto } from '@/auth/dto/register.dto.js';
import { LoginDto } from '@/auth/dto/login.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    return this.auth.register(dto, res);
  }

  @Public() @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.auth.validate(dto.email, dto.password);
    if (!user) throw new UnauthorizedException('Invalid email or password');
    return this.auth.issueTokens(user, res);
  }

  @Public() @HttpCode(200)
  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = await this.auth.useRefresh(req.cookies['refresh_token']);
    if (!user) throw new UnauthorizedException('Invalid refresh token');
    return this.auth.issueTokens(user, res);
  }

  @HttpCode(204)
  @Post('logout')
  async logout(@CurrentUser() user: { id: string }, @Res({ passthrough: true }) res: Response) {
    await this.auth.revokeAll(user.id);
    res.clearCookie('refresh_token', { path: '/auth' });
  }
}
