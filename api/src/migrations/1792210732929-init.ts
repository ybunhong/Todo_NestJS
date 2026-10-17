import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1792210732929 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "todo" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "status" character varying NOT NULL DEFAULT 'TODO', CONSTRAINT "PK_d429b7114371f6a35c5cb4776a7" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "todo"`);
    }

}
