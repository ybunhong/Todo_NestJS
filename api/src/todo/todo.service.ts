import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './entities/todo.entity.js';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';
import { TodoRepository } from './repositories/todo.repository.js';

@Injectable()
export class TodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todoRepository.create(createTodoDto);
  }

  async findAll(): Promise<Todo[]> {
    return this.todoRepository.findAll();
  }

  async findOne(id: number): Promise<Todo> {
    const todo = await this.todoRepository.findOne(id);
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    return this.todoRepository.update(id, updateTodoDto);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.todoRepository.remove(id);
  }
}
