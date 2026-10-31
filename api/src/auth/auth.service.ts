import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash, verify } from 'argon2';
import type { CookieOptions, Response } from 'express';
import { Role, User } from '@/user/entities/user.entity.js';
import { RefreshToken } from '@/user/entities/refresh-token.entity.js';
import { RegisterDto } from '@/auth/dto/register.dto.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private jwt: JwtService,
    private cfg: ConfigService,
  ) {
    this.refreshSecret = this.cfg.getOrThrow('JWT_REFRESH_SECRET');
    this.cookieOpts = {
      httpOnly: true,
      secure: this.cfg.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      path: '/auth',
    };
  }

  private refreshSecret: string;
  private cookieOpts: CookieOptions;

  async register(dto: RegisterDto, res: Response) {
    const existing = await this.userRepository.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email is already registered');

    const user = await this.userRepository.save(
      this.userRepository.create({
        email: dto.email,
        passwordHash: await hash(dto.password),
        role: Role.USER,
      }),
    );
    return this.issueTokens(user, res);
  }

  async validate(email: string, password: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne();
    if (!user) return null;
    const matches = await verify(user.passwordHash, password);
    return matches ? user : null;
  }

  async issueTokens(user: User, res: Response) {
    const payload = { sub: user.id, role: user.role };
    const access = await this.jwt.signAsync(payload);
    const refresh = await this.jwt.signAsync(payload, {
      secret: this.refreshSecret,
      expiresIn: '7d',
    });
    await this.saveRefresh(user.id, refresh);
    res.cookie('refresh_token', refresh, this.cookieOpts);
    return { accessToken: access };
  }

  private async saveRefresh(userId: string, token: string) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    const rt = this.refreshTokenRepository.create({
      token,
      userId,
      expiresAt,
    });
    await this.refreshTokenRepository.save(rt);
  }

  async useRefresh(token: string | undefined) {
    if (!token) return null;
    const rt = await this.refreshTokenRepository.findOne({
      where: { token },
    });
    if (!rt || rt.expiresAt < new Date()) {
      return null;
    }
    const user = await this.userRepository.findOne({
      where: { id: rt.userId },
    });
    await this.refreshTokenRepository.delete({ token });
    return user;
  }

  async revokeAll(userId: string) {
    await this.refreshTokenRepository.delete({ userId });
  }
}
