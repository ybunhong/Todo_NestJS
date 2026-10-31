import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Todo } from '@/todo/entities/todo.entity.js';
import { CreateTodoDto } from '@/todo/dto/create-todo.dto.js';
import { UpdateTodoDto } from '@/todo/dto/update-todo.dto.js';
import { TodoRepository } from '@/todo/repositories/todo.repository.js';

@Injectable()
export class TodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  async create(createTodoDto: CreateTodoDto, userId: string): Promise<Todo> {
    return this.todoRepository.create({ ...createTodoDto, ownerId: userId });
  }

  async findAll(userId: string): Promise<Todo[]> {
    return this.todoRepository.findAll(userId);
  }

  async findOne(id: number, userId: string): Promise<Todo> {
    const todo = await this.todoRepository.findOne(id, userId);
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto, userId: string): Promise<Todo> {
    const todo = await this.findOne(id, userId);
    if (todo.ownerId !== userId) {
      throw new ForbiddenException('You can only update your own todos');
    }
    return this.todoRepository.update(id, updateTodoDto);
  }

  async remove(id: number, userId: string): Promise<void> {
    const todo = await this.findOne(id, userId);
    if (todo.ownerId !== userId) {
      throw new ForbiddenException('You can only delete your own todos');
    }
    await this.todoRepository.remove(id);
  }
}
