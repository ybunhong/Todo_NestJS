# Todo App

A full-stack todo application with NestJS backend and React frontend.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (running on localhost:5432)

## Setup

1. Create the PostgreSQL database:
```bash
createdb todo_db
```

2. Install dependencies for the API:
```bash
cd api
npm install
```

3. Install dependencies for the frontend:
```bash
cd ../app
npm install
```

## Running the Application

1. Start the backend API:
```bash
cd api
npm run start:dev
```
The API will run on http://localhost:3000

2. In a new terminal, start the frontend:
```bash
cd app
npm run dev
```
The frontend will run on http://localhost:5173

## Database Configuration

The API uses hardcoded PostgreSQL credentials:
- Host: localhost
- Port: 5432
- Username: postgres
- Password: postgres
- Database: todo_db

Make sure your PostgreSQL server is running with these credentials before starting the API.
