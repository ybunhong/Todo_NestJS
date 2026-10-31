import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { TodoService } from '@/todo/todo.service.js';
import { CreateTodoDto } from '@/todo/dto/create-todo.dto.js';
import { UpdateTodoDto } from '@/todo/dto/update-todo.dto.js';
import { CurrentUser } from '@/auth/decorators/current-user.decorator.js';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto, @CurrentUser() user: any) {
    return this.todoService.create(createTodoDto, user.id);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.todoService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.todoService.findOne(+id, user.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto, @CurrentUser() user: any) {
    return this.todoService.update(+id, updateTodoDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.todoService.remove(+id, user.id);
  }
}
