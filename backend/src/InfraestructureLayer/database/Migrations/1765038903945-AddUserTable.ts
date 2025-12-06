import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserTable1765038903945 implements MigrationInterface {
    name = 'AddUserTable1765038903945'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "song" DROP CONSTRAINT "FK_c1b6644942ac9914001543107d5"`);
        await queryRunner.query(`ALTER TABLE "song" ALTER COLUMN "album_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "song" ADD CONSTRAINT "FK_c1b6644942ac9914001543107d5" FOREIGN KEY ("album_id") REFERENCES "album_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "song" DROP CONSTRAINT "FK_c1b6644942ac9914001543107d5"`);
        await queryRunner.query(`ALTER TABLE "song" ALTER COLUMN "album_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "song" ADD CONSTRAINT "FK_c1b6644942ac9914001543107d5" FOREIGN KEY ("album_id") REFERENCES "album_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
