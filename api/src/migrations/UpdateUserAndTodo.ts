import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserAndTodo1730000000001 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Enable UUID extension
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // Drop the old user table
        await queryRunner.query(`DROP TABLE IF EXISTS "user"`);

        // Create the new users table with UUID and relationships
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL UNIQUE,
                "passwordHash" character varying NOT NULL,
                "role" character varying NOT NULL DEFAULT 'user',
                CONSTRAINT "PK_16d4f7d636df436d6762aed77f6" PRIMARY KEY ("id")
            )
        `);

        // Add ownerId column to todo table (nullable)
        await queryRunner.query(`
            ALTER TABLE "todo" ADD COLUMN "ownerId" uuid NULL
        `);

        // Add foreign key constraint
        await queryRunner.query(`
            ALTER TABLE "todo" ADD CONSTRAINT "FK_todo_owner" 
            FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove foreign key constraint
        await queryRunner.query(`
            ALTER TABLE "todo" DROP CONSTRAINT "FK_todo_owner"
        `);

        // Remove ownerId column from todo table
        await queryRunner.query(`
            ALTER TABLE "todo" DROP COLUMN "ownerId"
        `);

        // Drop the new users table
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
