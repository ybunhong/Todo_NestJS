import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshToken1730000000002 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "refresh_tokens" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "token" character varying NOT NULL,
                "userId" uuid NOT NULL,
                "expiresAt" timestamp NOT NULL,
                CONSTRAINT "PK_refresh_tokens" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_refresh_tokens_user"
            FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_refresh_tokens_user"
        `);

        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    }

}
