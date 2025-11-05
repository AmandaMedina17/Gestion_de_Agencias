import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIncomeTable1762266954318 implements MigrationInterface {
    name = 'AddIncomeTable1762266954318'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "income_entity" ("id" character varying NOT NULL, "activityID" character varying NOT NULL, "mount" numeric(10,2) NOT NULL, "date" date NOT NULL, "responsible" character varying NOT NULL, CONSTRAINT "PK_bf14d077265256e2762f9e86a77" PRIMARY KEY ("id", "activityID"))`);
        await queryRunner.query(`ALTER TABLE "income_entity" ADD CONSTRAINT "FK_b30dfa79fb31c8b32255ee7c8d8" FOREIGN KEY ("activityID") REFERENCES "activity_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "income_entity" DROP CONSTRAINT "FK_b30dfa79fb31c8b32255ee7c8d8"`);
        await queryRunner.query(`DROP TABLE "income_entity"`);
    }

}
