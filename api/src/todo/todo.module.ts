import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { Todo } from '@/todo/entities/todo.entity';
import { TodoRepository } from '@/todo/repositories/todo.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Todo])],
  controllers: [TodoController],
  providers: [TodoService, TodoRepository],
  exports: [TodoRepository],
})
export class TodoModule {}
