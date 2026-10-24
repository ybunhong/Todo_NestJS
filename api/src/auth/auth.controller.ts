import { Controller, Post, Body, HttpCode, Res, Req } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from '@/auth/decorators/public.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public() @HttpCode(200)
  @Post('login')
  async login(@Body() dto: { email: string; password: string }, @Res({ passthrough: true }) res: Response) {
    const u = await this.auth.validate(dto.email, dto.password);
    return this.auth.issueTokens(u!, res);
  }

  @Public() @HttpCode(200)
  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies['refresh_token'];
    const user = await this.auth.useRefresh(token);
    if (!user) throw new Error('Invalid refresh token');
    return this.auth.issueTokens(user, res);
  }

  @HttpCode(204)
  @Post('logout')
  async logout(@CurrentUser() user: any, @Res({ passthrough: true }) res: Response) {
    await this.auth.revokeAll(user.id);
    res.clearCookie('refresh_token', { path: '/api/auth' });
  }
}
