import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from '@/todo/entities/todo.entity';

@Injectable()
export class TodoRepository {
  constructor(
    @InjectRepository(Todo)
    private readonly repository: Repository<Todo>,
  ) {}

  async create(todo: Partial<Todo>): Promise<Todo> {
    const newTodo = this.repository.create(todo);
    return this.repository.save(newTodo);
  }

  async findAll(): Promise<Todo[]> {
    return this.repository.find();
  }

  async findOne(id: number): Promise<Todo | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: number, todo: Partial<Todo>): Promise<Todo> {
    await this.repository.update(id, todo);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error(`Todo with id ${id} not found after update`);
    }
    return updated;
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
