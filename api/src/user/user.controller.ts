import { Body, Controller, Delete, Get, HttpCode, Param, Patch } from '@nestjs/common';
import { Role } from '@/user/entities/user.entity.js';
import { Roles } from '@/auth/decorators/roles.decorator.js';
import { CurrentUser } from '@/auth/decorators/current-user.decorator.js';
import { UpdateRoleDto } from '@/user/dto/update-role.dto.js';
import { UserService } from '@/user/user.service.js';

@Roles(Role.ADMIN)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id/role')
  changeRole(
    @Param('id') id: string,
    @Body() dto: UpdateRoleDto,
    @CurrentUser() actor: { id: string },
  ) {
    return this.userService.changeRole(actor.id, id, dto.role);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() actor: { id: string }) {
    return this.userService.remove(actor.id, id);
  }
}
