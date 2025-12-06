import { MigrationInterface, QueryRunner } from "typeorm";

export class NombreDeLaMigracion1764970791664 implements MigrationInterface {
    name = 'NombreDeLaMigracion1764970791664'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "billboardList" RENAME COLUMN "entry_date" TO "public_date"`);
        await queryRunner.query(`ALTER TABLE "album_entity" DROP COLUMN "numberOfTracks"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "album_entity" ADD "numberOfTracks" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "billboardList" RENAME COLUMN "public_date" TO "entry_date"`);
    }

}
