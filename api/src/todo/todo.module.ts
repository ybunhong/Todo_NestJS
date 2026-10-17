import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoService } from './todo.service.js';
import { TodoController } from './todo.controller.js';
import { Todo } from './entities/todo.entity.js';
import { TodoRepository } from './repositories/todo.repository.js';

@Module({
  imports: [TypeOrmModule.forFeature([Todo])],
  controllers: [TodoController],
  providers: [TodoService, TodoRepository],
  exports: [TodoRepository],
})
export class TodoModule {}
