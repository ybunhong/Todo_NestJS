import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, User } from '@/user/entities/user.entity.js';
import { RefreshToken } from '@/user/entities/refresh-token.entity.js';
import { UserRepository } from '@/user/repositories/user.repository.js';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async changeRole(actorId: string, id: string, role: Role): Promise<User> {
    if (actorId === id) {
      throw new ForbiddenException('You cannot change your own role');
    }
    await this.findOne(id);
    return this.userRepository.updateRole(id, role);
  }

  async remove(actorId: string, id: string): Promise<void> {
    if (actorId === id) {
      throw new ForbiddenException('You cannot delete your own account');
    }
    await this.findOne(id);
    await this.userRepository.remove(id);
    await this.refreshTokenRepository.delete({ userId: id });
  }
}
