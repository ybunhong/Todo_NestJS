import { IsEnum } from 'class-validator';
import { Role } from '@/user/entities/user.entity.js';

export class UpdateRoleDto {
  @IsEnum(Role)
  role: Role;
}
