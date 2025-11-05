import { MigrationInterface, QueryRunner } from "typeorm";

export class FixSongAndBillboardTableAndAddUserTable1762372960066 implements MigrationInterface {
    name = 'FixSongAndBillboardTableAndAddUserTable1762372960066'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('AGENCY_MANAGER', 'ARTIST', 'ADMIN')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "apprentice" ALTER COLUMN "status" SET DEFAULT 'EN_ENTRENAMIENTO'`);
        await queryRunner.query(`ALTER TABLE "apprentice" ALTER COLUMN "trainingLevel" SET DEFAULT 'PRINCIPIANTE'`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "FK_b742d8c0dfb486f96f1eb711834"`);
        await queryRunner.query(`ALTER TABLE "billboardList" DROP CONSTRAINT "PK_5b4576e51aef7706a66fb729c22"`);
        await queryRunner.query(`ALTER TABLE "billboardList" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "billboardList" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "billboardList" ADD CONSTRAINT "PK_5b4576e51aef7706a66fb729c22" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "FK_f86489de1eda21a0e1ad2a987b0"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "PK_695c061c9603f167b33e6d188eb"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "PK_b742d8c0dfb486f96f1eb711834" PRIMARY KEY ("billboard_list_id")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP COLUMN "song_id"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD "song_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "PK_b742d8c0dfb486f96f1eb711834"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "PK_695c061c9603f167b33e6d188eb" PRIMARY KEY ("billboard_list_id", "song_id")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "PK_695c061c9603f167b33e6d188eb"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "PK_f86489de1eda21a0e1ad2a987b0" PRIMARY KEY ("song_id")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP COLUMN "billboard_list_id"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD "billboard_list_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "PK_f86489de1eda21a0e1ad2a987b0"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "PK_695c061c9603f167b33e6d188eb" PRIMARY KEY ("song_id", "billboard_list_id")`);
        await queryRunner.query(`ALTER TABLE "song" DROP CONSTRAINT "PK_baaa977f861cce6ff954ccee285"`);
        await queryRunner.query(`ALTER TABLE "song" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "song" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "song" ADD CONSTRAINT "PK_baaa977f861cce6ff954ccee285" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "FK_f86489de1eda21a0e1ad2a987b0" FOREIGN KEY ("song_id") REFERENCES "song"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "FK_b742d8c0dfb486f96f1eb711834" FOREIGN KEY ("billboard_list_id") REFERENCES "billboardList"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "FK_b742d8c0dfb486f96f1eb711834"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "FK_f86489de1eda21a0e1ad2a987b0"`);
        await queryRunner.query(`ALTER TABLE "song" DROP CONSTRAINT "PK_baaa977f861cce6ff954ccee285"`);
        await queryRunner.query(`ALTER TABLE "song" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "song" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "song" ADD CONSTRAINT "PK_baaa977f861cce6ff954ccee285" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "PK_695c061c9603f167b33e6d188eb"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "PK_f86489de1eda21a0e1ad2a987b0" PRIMARY KEY ("song_id")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP COLUMN "billboard_list_id"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD "billboard_list_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "PK_f86489de1eda21a0e1ad2a987b0"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "PK_695c061c9603f167b33e6d188eb" PRIMARY KEY ("billboard_list_id", "song_id")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "PK_695c061c9603f167b33e6d188eb"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "PK_b742d8c0dfb486f96f1eb711834" PRIMARY KEY ("billboard_list_id")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP COLUMN "song_id"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD "song_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "PK_b742d8c0dfb486f96f1eb711834"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "PK_695c061c9603f167b33e6d188eb" PRIMARY KEY ("song_id", "billboard_list_id")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "FK_f86489de1eda21a0e1ad2a987b0" FOREIGN KEY ("song_id") REFERENCES "song"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "billboardList" DROP CONSTRAINT "PK_5b4576e51aef7706a66fb729c22"`);
        await queryRunner.query(`ALTER TABLE "billboardList" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "billboardList" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "billboardList" ADD CONSTRAINT "PK_5b4576e51aef7706a66fb729c22" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "FK_b742d8c0dfb486f96f1eb711834" FOREIGN KEY ("billboard_list_id") REFERENCES "billboardList"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "apprentice" ALTER COLUMN "trainingLevel" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "apprentice" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
