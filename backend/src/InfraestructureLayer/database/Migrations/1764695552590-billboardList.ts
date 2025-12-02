import { MigrationInterface, QueryRunner } from "typeorm";

export class BillboardList1764695552590 implements MigrationInterface {
    name = 'BillboardList1764695552590'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "FK_b742d8c0dfb486f96f1eb711834"`);
        await queryRunner.query(`ALTER TABLE "billboardList" DROP CONSTRAINT "PK_5b4576e51aef7706a66fb729c22"`);
        await queryRunner.query(`ALTER TABLE "billboardList" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "billboardList" ADD "id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "billboardList" ADD CONSTRAINT "PK_5b4576e51aef7706a66fb729c22" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "PK_695c061c9603f167b33e6d188eb"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "PK_f86489de1eda21a0e1ad2a987b0" PRIMARY KEY ("song_id")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP COLUMN "billboard_list_id"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD "billboard_list_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "PK_f86489de1eda21a0e1ad2a987b0"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "PK_695c061c9603f167b33e6d188eb" PRIMARY KEY ("song_id", "billboard_list_id")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "FK_b742d8c0dfb486f96f1eb711834" FOREIGN KEY ("billboard_list_id") REFERENCES "billboardList"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "FK_b742d8c0dfb486f96f1eb711834"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "PK_695c061c9603f167b33e6d188eb"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "PK_f86489de1eda21a0e1ad2a987b0" PRIMARY KEY ("song_id")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP COLUMN "billboard_list_id"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD "billboard_list_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "PK_f86489de1eda21a0e1ad2a987b0"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "PK_695c061c9603f167b33e6d188eb" PRIMARY KEY ("song_id", "billboard_list_id")`);
        await queryRunner.query(`ALTER TABLE "billboardList" DROP CONSTRAINT "PK_5b4576e51aef7706a66fb729c22"`);
        await queryRunner.query(`ALTER TABLE "billboardList" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "billboardList" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "billboardList" ADD CONSTRAINT "PK_5b4576e51aef7706a66fb729c22" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "FK_b742d8c0dfb486f96f1eb711834" FOREIGN KEY ("billboard_list_id") REFERENCES "billboardList"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
