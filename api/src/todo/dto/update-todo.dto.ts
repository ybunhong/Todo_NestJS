import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoDto } from '@/todo/dto/create-todo.dto.js';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {}
