import { MigrationInterface, QueryRunner } from "typeorm";

export class AlbumMigration1764705168980 implements MigrationInterface {
    name = 'AlbumMigration1764705168980'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "billboardList" DROP COLUMN "public_date"`);
        await queryRunner.query(`ALTER TABLE "billboardList" DROP COLUMN "scope"`);
        await queryRunner.query(`DROP TYPE "public"."billboardList_scope_enum"`);
        await queryRunner.query(`ALTER TABLE "billboardList" DROP COLUMN "end_list"`);
        await queryRunner.query(`ALTER TABLE "billboardList" ADD "entry_date" TIMESTAMP NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."billboardList_songbillboards_enum" AS ENUM('INTERNACIONAL', 'NACIONAL')`);
        await queryRunner.query(`ALTER TABLE "billboardList" ADD "songBillboards" "public"."billboardList_songbillboards_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "FK_f86489de1eda21a0e1ad2a987b0"`);
        await queryRunner.query(`ALTER TABLE "song" DROP CONSTRAINT "PK_baaa977f861cce6ff954ccee285"`);
        await queryRunner.query(`ALTER TABLE "song" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "song" ADD "id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "song" ADD CONSTRAINT "PK_baaa977f861cce6ff954ccee285" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "FK_b742d8c0dfb486f96f1eb711834"`);
        await queryRunner.query(`ALTER TABLE "billboardList" DROP CONSTRAINT "PK_5b4576e51aef7706a66fb729c22"`);
        await queryRunner.query(`ALTER TABLE "billboardList" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "billboardList" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "billboardList" ADD CONSTRAINT "PK_5b4576e51aef7706a66fb729c22" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "PK_695c061c9603f167b33e6d188eb"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "PK_b742d8c0dfb486f96f1eb711834" PRIMARY KEY ("billboard_list_id")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP COLUMN "song_id"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD "song_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "PK_b742d8c0dfb486f96f1eb711834"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "PK_695c061c9603f167b33e6d188eb" PRIMARY KEY ("billboard_list_id", "song_id")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "PK_695c061c9603f167b33e6d188eb"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "PK_f86489de1eda21a0e1ad2a987b0" PRIMARY KEY ("song_id")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP COLUMN "billboard_list_id"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD "billboard_list_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "PK_f86489de1eda21a0e1ad2a987b0"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "PK_695c061c9603f167b33e6d188eb" PRIMARY KEY ("song_id", "billboard_list_id")`);
        await queryRunner.query(`ALTER TABLE "award_entity" ADD CONSTRAINT "FK_c65459eb3b6459a84c86330cb73" FOREIGN KEY ("album_id") REFERENCES "album_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "FK_f86489de1eda21a0e1ad2a987b0" FOREIGN KEY ("song_id") REFERENCES "song"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "FK_b742d8c0dfb486f96f1eb711834" FOREIGN KEY ("billboard_list_id") REFERENCES "billboardList"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "FK_b742d8c0dfb486f96f1eb711834"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "FK_f86489de1eda21a0e1ad2a987b0"`);
        await queryRunner.query(`ALTER TABLE "award_entity" DROP CONSTRAINT "FK_c65459eb3b6459a84c86330cb73"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "PK_695c061c9603f167b33e6d188eb"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "PK_f86489de1eda21a0e1ad2a987b0" PRIMARY KEY ("song_id")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP COLUMN "billboard_list_id"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD "billboard_list_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "PK_f86489de1eda21a0e1ad2a987b0"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "PK_695c061c9603f167b33e6d188eb" PRIMARY KEY ("billboard_list_id", "song_id")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "PK_695c061c9603f167b33e6d188eb"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "PK_b742d8c0dfb486f96f1eb711834" PRIMARY KEY ("billboard_list_id")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP COLUMN "song_id"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD "song_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "PK_b742d8c0dfb486f96f1eb711834"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "PK_695c061c9603f167b33e6d188eb" PRIMARY KEY ("song_id", "billboard_list_id")`);
        await queryRunner.query(`ALTER TABLE "billboardList" DROP CONSTRAINT "PK_5b4576e51aef7706a66fb729c22"`);
        await queryRunner.query(`ALTER TABLE "billboardList" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "billboardList" ADD "id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "billboardList" ADD CONSTRAINT "PK_5b4576e51aef7706a66fb729c22" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "FK_b742d8c0dfb486f96f1eb711834" FOREIGN KEY ("billboard_list_id") REFERENCES "billboardList"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "song" DROP CONSTRAINT "PK_baaa977f861cce6ff954ccee285"`);
        await queryRunner.query(`ALTER TABLE "song" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "song" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "song" ADD CONSTRAINT "PK_baaa977f861cce6ff954ccee285" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "FK_f86489de1eda21a0e1ad2a987b0" FOREIGN KEY ("song_id") REFERENCES "song"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "billboardList" DROP COLUMN "songBillboards"`);
        await queryRunner.query(`DROP TYPE "public"."billboardList_songbillboards_enum"`);
        await queryRunner.query(`ALTER TABLE "billboardList" DROP COLUMN "entry_date"`);
        await queryRunner.query(`ALTER TABLE "billboardList" ADD "end_list" integer NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."billboardList_scope_enum" AS ENUM('INTERNACIONAL', 'NACIONAL')`);
        await queryRunner.query(`ALTER TABLE "billboardList" ADD "scope" "public"."billboardList_scope_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "billboardList" ADD "public_date" TIMESTAMP NOT NULL`);
    }

}
