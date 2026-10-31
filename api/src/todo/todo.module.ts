import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoService } from './todo.service.js';
import { TodoController } from './todo.controller.js';
import { Todo } from '@/todo/entities/todo.entity.js';
import { TodoRepository } from '@/todo/repositories/todo.repository.js';

@Module({
  imports: [TypeOrmModule.forFeature([Todo])],
  controllers: [TodoController],
  providers: [TodoService, TodoRepository],
  exports: [TodoRepository],
})
export class TodoModule {}
