import { DataSource } from 'typeorm';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'AAA-todo',
  entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'migrations', '*.ts')],
  synchronize: false,
});
