# Todo Service with PostgreSQL Setup

## Overview
A complete NestJS todo service with PostgreSQL database integration using TypeORM.

## Files Created/Modified

### 1. Entity
- `src/todo/entities/todo.entity.ts` - Todo entity with TypeORM decorators
  - Fields: id, title, completed, description, createdAt, updatedAt

### 2. DTOs
- `src/todo/dto/create-todo.dto.ts` - DTO for creating todos with validation
- `src/todo/dto/update-todo.dto.ts` - DTO for updating todos (extends CreateTodoDto)

### 3. Service
- `src/todo/todo.service.ts` - Todo service with CRUD operations
  - create() - Create a new todo
  - findAll() - Get all todos
  - findOne() - Get a single todo by id
  - update() - Update a todo
  - remove() - Delete a todo

### 4. Controller
- `src/todo/todo.controller.ts` - REST API endpoints
  - POST /todo - Create todo
  - GET /todo - Get all todos
  - GET /todo/:id - Get single todo
  - PUT /todo/:id - Update todo
  - DELETE /todo/:id - Delete todo

### 5. Module
- `src/todo/todo.module.ts` - Todo module with TypeORM feature module
- `src/app.module.ts` - App module with TypeORM and ConfigModule configuration

### 6. Main
- `src/main.ts` - Added global validation pipe

### 7. Environment
- `.env.example` - Example environment variables file

## Database Configuration
The API uses hardcoded PostgreSQL credentials:
- Host: localhost
- Port: 5432
- Username: postgres
- Password: postgres
- Database: todo_db

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Ensure PostgreSQL is running and the database exists:
```bash
# Create database
createdb todo_db
```

3. Start the application:
```bash
npm run start:dev
```

## API Endpoints

- `POST /todo` - Create a new todo
  ```json
  {
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false
  }
  ```

- `GET /todo` - Get all todos

- `GET /todo/:id` - Get a specific todo

- `PUT /todo/:id` - Update a todo
  ```json
  {
    "title": "Buy groceries",
    "completed": true
  }
  ```

- `DELETE /todo/:id` - Delete a todo

## Notes
- `synchronize: true` is enabled for auto-migration (not recommended for production)
- The todo table will be automatically created on first run
- Validation is enabled globally for all DTOs
