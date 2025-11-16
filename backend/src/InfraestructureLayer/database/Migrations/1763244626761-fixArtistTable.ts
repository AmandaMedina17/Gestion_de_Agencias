import { MigrationInterface, QueryRunner } from "typeorm";

export class FixArtistTable1763244626761 implements MigrationInterface {
    name = 'FixArtistTable1763244626761'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "apprentice" DROP CONSTRAINT "FK_0bf4ac157d2ba6831ecbd6a88b3"`);
        await queryRunner.query(`ALTER TABLE "apprentice" DROP CONSTRAINT "REL_0bf4ac157d2ba6831ecbd6a88b"`);
        await queryRunner.query(`ALTER TABLE "apprentice" DROP COLUMN "apprentice_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "apprentice" ADD "apprentice_id" character varying`);
        await queryRunner.query(`ALTER TABLE "apprentice" ADD CONSTRAINT "REL_0bf4ac157d2ba6831ecbd6a88b" UNIQUE ("apprentice_id")`);
        await queryRunner.query(`ALTER TABLE "apprentice" ADD CONSTRAINT "FK_0bf4ac157d2ba6831ecbd6a88b3" FOREIGN KEY ("apprentice_id") REFERENCES "artist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
