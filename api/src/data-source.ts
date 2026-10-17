import { DataSource } from 'typeorm';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'todo_db',
  entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
  synchronize: true,
});
