import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateApprenticeTable1762360125382 implements MigrationInterface {
    name = 'UpdateApprenticeTable1762360125382'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "apprentice" ALTER COLUMN "status" SET DEFAULT 'EN_ENTRENAMIENTO'`);
        await queryRunner.query(`ALTER TABLE "apprentice" ALTER COLUMN "trainingLevel" SET DEFAULT 'PRINCIPIANTE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "apprentice" ALTER COLUMN "trainingLevel" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "apprentice" ALTER COLUMN "status" DROP DEFAULT`);
    }

}
