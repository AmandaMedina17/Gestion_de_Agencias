import { MigrationInterface, QueryRunner } from "typeorm";

export class JuanmiMigrations1764723373970 implements MigrationInterface {
    name = 'JuanmiMigrations1764723373970'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "award_entity" DROP CONSTRAINT "FK_c65459eb3b6459a84c86330cb73"`);
        await queryRunner.query(`ALTER TABLE "billboardList" DROP COLUMN "songBillboards"`);
        await queryRunner.query(`DROP TYPE "public"."billboardList_songbillboards_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."billboardList_scope_enum" AS ENUM('INTERNACIONAL', 'NACIONAL')`);
        await queryRunner.query(`ALTER TABLE "billboardList" ADD "scope" "public"."billboardList_scope_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "billboardList" ADD "end_list" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contract_entity" ADD "contract_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contract_entity" DROP CONSTRAINT "PK_23fca0811537cfe7609b4902179"`);
        await queryRunner.query(`ALTER TABLE "contract_entity" ADD CONSTRAINT "PK_da2ce5de70d2a871a3fc2021126" PRIMARY KEY ("startDate", "endDate", "agencyID", "artistID", "contract_id")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "FK_f86489de1eda21a0e1ad2a987b0"`);
        await queryRunner.query(`ALTER TABLE "song" DROP CONSTRAINT "PK_baaa977f861cce6ff954ccee285"`);
        await queryRunner.query(`ALTER TABLE "song" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "song" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "song" ADD CONSTRAINT "PK_baaa977f861cce6ff954ccee285" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "FK_b742d8c0dfb486f96f1eb711834"`);
        await queryRunner.query(`ALTER TABLE "billboardList" DROP CONSTRAINT "PK_5b4576e51aef7706a66fb729c22"`);
        await queryRunner.query(`ALTER TABLE "billboardList" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "billboardList" ADD "id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "billboardList" ADD CONSTRAINT "PK_5b4576e51aef7706a66fb729c22" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "PK_695c061c9603f167b33e6d188eb"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "PK_b742d8c0dfb486f96f1eb711834" PRIMARY KEY ("billboard_list_id")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP COLUMN "song_id"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD "song_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "PK_b742d8c0dfb486f96f1eb711834"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "PK_695c061c9603f167b33e6d188eb" PRIMARY KEY ("billboard_list_id", "song_id")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "PK_695c061c9603f167b33e6d188eb"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "PK_f86489de1eda21a0e1ad2a987b0" PRIMARY KEY ("song_id")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP COLUMN "billboard_list_id"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD "billboard_list_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "PK_f86489de1eda21a0e1ad2a987b0"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "PK_695c061c9603f167b33e6d188eb" PRIMARY KEY ("song_id", "billboard_list_id")`);
        await queryRunner.query(`ALTER TABLE "contract_entity" DROP CONSTRAINT "PK_da2ce5de70d2a871a3fc2021126"`);
        await queryRunner.query(`ALTER TABLE "contract_entity" ADD CONSTRAINT "PK_7ebfc5fd921c1cec87f8bc06f6c" PRIMARY KEY ("endDate", "agencyID", "artistID", "contract_id")`);
        await queryRunner.query(`ALTER TABLE "contract_entity" DROP COLUMN "startDate"`);
        await queryRunner.query(`ALTER TABLE "contract_entity" ADD "startDate" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contract_entity" DROP CONSTRAINT "PK_7ebfc5fd921c1cec87f8bc06f6c"`);
        await queryRunner.query(`ALTER TABLE "contract_entity" ADD CONSTRAINT "PK_da2ce5de70d2a871a3fc2021126" PRIMARY KEY ("endDate", "agencyID", "artistID", "contract_id", "startDate")`);
        await queryRunner.query(`ALTER TABLE "contract_entity" DROP CONSTRAINT "PK_da2ce5de70d2a871a3fc2021126"`);
        await queryRunner.query(`ALTER TABLE "contract_entity" ADD CONSTRAINT "PK_b1c3bf42e187161d08403cb06a9" PRIMARY KEY ("agencyID", "artistID", "contract_id", "startDate")`);
        await queryRunner.query(`ALTER TABLE "contract_entity" DROP COLUMN "endDate"`);
        await queryRunner.query(`ALTER TABLE "contract_entity" ADD "endDate" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contract_entity" DROP CONSTRAINT "PK_b1c3bf42e187161d08403cb06a9"`);
        await queryRunner.query(`ALTER TABLE "contract_entity" ADD CONSTRAINT "PK_da2ce5de70d2a871a3fc2021126" PRIMARY KEY ("agencyID", "artistID", "contract_id", "startDate", "endDate")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "FK_f86489de1eda21a0e1ad2a987b0" FOREIGN KEY ("song_id") REFERENCES "song"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "FK_b742d8c0dfb486f96f1eb711834" FOREIGN KEY ("billboard_list_id") REFERENCES "billboardList"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "FK_b742d8c0dfb486f96f1eb711834"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "FK_f86489de1eda21a0e1ad2a987b0"`);
        await queryRunner.query(`ALTER TABLE "contract_entity" DROP CONSTRAINT "PK_da2ce5de70d2a871a3fc2021126"`);
        await queryRunner.query(`ALTER TABLE "contract_entity" ADD CONSTRAINT "PK_b1c3bf42e187161d08403cb06a9" PRIMARY KEY ("agencyID", "artistID", "contract_id", "startDate")`);
        await queryRunner.query(`ALTER TABLE "contract_entity" DROP COLUMN "endDate"`);
        await queryRunner.query(`ALTER TABLE "contract_entity" ADD "endDate" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contract_entity" DROP CONSTRAINT "PK_b1c3bf42e187161d08403cb06a9"`);
        await queryRunner.query(`ALTER TABLE "contract_entity" ADD CONSTRAINT "PK_da2ce5de70d2a871a3fc2021126" PRIMARY KEY ("endDate", "agencyID", "artistID", "contract_id", "startDate")`);
        await queryRunner.query(`ALTER TABLE "contract_entity" DROP CONSTRAINT "PK_da2ce5de70d2a871a3fc2021126"`);
        await queryRunner.query(`ALTER TABLE "contract_entity" ADD CONSTRAINT "PK_7ebfc5fd921c1cec87f8bc06f6c" PRIMARY KEY ("endDate", "agencyID", "artistID", "contract_id")`);
        await queryRunner.query(`ALTER TABLE "contract_entity" DROP COLUMN "startDate"`);
        await queryRunner.query(`ALTER TABLE "contract_entity" ADD "startDate" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contract_entity" DROP CONSTRAINT "PK_7ebfc5fd921c1cec87f8bc06f6c"`);
        await queryRunner.query(`ALTER TABLE "contract_entity" ADD CONSTRAINT "PK_da2ce5de70d2a871a3fc2021126" PRIMARY KEY ("startDate", "endDate", "agencyID", "artistID", "contract_id")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "PK_695c061c9603f167b33e6d188eb"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "PK_f86489de1eda21a0e1ad2a987b0" PRIMARY KEY ("song_id")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP COLUMN "billboard_list_id"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD "billboard_list_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "PK_f86489de1eda21a0e1ad2a987b0"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "PK_695c061c9603f167b33e6d188eb" PRIMARY KEY ("billboard_list_id", "song_id")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "PK_695c061c9603f167b33e6d188eb"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "PK_b742d8c0dfb486f96f1eb711834" PRIMARY KEY ("billboard_list_id")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP COLUMN "song_id"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD "song_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "song_billboard" DROP CONSTRAINT "PK_b742d8c0dfb486f96f1eb711834"`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "PK_695c061c9603f167b33e6d188eb" PRIMARY KEY ("billboard_list_id", "song_id")`);
        await queryRunner.query(`ALTER TABLE "billboardList" DROP CONSTRAINT "PK_5b4576e51aef7706a66fb729c22"`);
        await queryRunner.query(`ALTER TABLE "billboardList" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "billboardList" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "billboardList" ADD CONSTRAINT "PK_5b4576e51aef7706a66fb729c22" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "FK_b742d8c0dfb486f96f1eb711834" FOREIGN KEY ("billboard_list_id") REFERENCES "billboardList"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "song" DROP CONSTRAINT "PK_baaa977f861cce6ff954ccee285"`);
        await queryRunner.query(`ALTER TABLE "song" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "song" ADD "id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "song" ADD CONSTRAINT "PK_baaa977f861cce6ff954ccee285" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "song_billboard" ADD CONSTRAINT "FK_f86489de1eda21a0e1ad2a987b0" FOREIGN KEY ("song_id") REFERENCES "song"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contract_entity" DROP CONSTRAINT "PK_da2ce5de70d2a871a3fc2021126"`);
        await queryRunner.query(`ALTER TABLE "contract_entity" ADD CONSTRAINT "PK_23fca0811537cfe7609b4902179" PRIMARY KEY ("startDate", "endDate", "agencyID", "artistID")`);
        await queryRunner.query(`ALTER TABLE "contract_entity" DROP COLUMN "contract_id"`);
        await queryRunner.query(`ALTER TABLE "billboardList" DROP COLUMN "end_list"`);
        await queryRunner.query(`ALTER TABLE "billboardList" DROP COLUMN "scope"`);
        await queryRunner.query(`DROP TYPE "public"."billboardList_scope_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."billboardList_songbillboards_enum" AS ENUM('INTERNACIONAL', 'NACIONAL')`);
        await queryRunner.query(`ALTER TABLE "billboardList" ADD "songBillboards" "public"."billboardList_songbillboards_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "award_entity" ADD CONSTRAINT "FK_c65459eb3b6459a84c86330cb73" FOREIGN KEY ("album_id") REFERENCES "album_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
