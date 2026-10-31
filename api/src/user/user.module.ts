import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/user/entities/user.entity.js';
import { RefreshToken } from '@/user/entities/refresh-token.entity.js';
import { UserRepository } from '@/user/repositories/user.repository.js';
import { UserService } from '@/user/user.service.js';
import { UserController } from '@/user/user.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([User, RefreshToken])],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserRepository],
})
export class UserModule {}
