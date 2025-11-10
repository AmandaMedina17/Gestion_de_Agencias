// src/app.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth.module";
import { UserOrmEntity } from "../InfraestructureLayer/database/Entities/UserEntity";
import { DatabaseModule } from "./DataBaseModule";
import { ResponsibleModule } from "./ResponsibleModule";
import { AppController } from "@presentation/controllers/app.controller";
import { AppService } from "@application/services/app.service";
import { ResponsibleEntity } from "../InfraestructureLayer/database/Entities/ResponsibleEntity";
import { ActivityResponsibleEntity } from "../InfraestructureLayer/database/Entities/ActivityResponsibleEntity";
import { ActivityDateEntity } from "../InfraestructureLayer/database/Entities/ActivityDateEntity";
import { ActivityEntity } from "../InfraestructureLayer/database/Entities/ActivityEntity";
import { ActivityPlaceEntity } from "../InfraestructureLayer/database/Entities/ActivityPlaceEntity";
import { AgencyEntity } from "../InfraestructureLayer/database/Entities/AgencyEntity";
import { AlbumEntity } from "../InfraestructureLayer/database/Entities/AlbumEntity";
import { ApprenticeEntity } from "../InfraestructureLayer/database/Entities/ApprenticeEntity";
import { ApprenticeEvaluationEntity } from "../InfraestructureLayer/database/Entities/ApprenticeEvaluationEntity";
import { ArtistActivityEntity } from "../InfraestructureLayer/database/Entities/ArtistActivityEntity";
import { ArtistAgencyMembershipEntity } from "../InfraestructureLayer/database/Entities/ArtistAgencyMembershipEntity";
import { ArtistCollaborationEntity } from "../InfraestructureLayer/database/Entities/ArtistCollaborationEntity";
import { ArtistEntity } from "../InfraestructureLayer/database/Entities/ArtistEntity";
import { ArtistGroupCollaborationEntity } from "../InfraestructureLayer/database/Entities/ArtistGroupCollaborationEntity";
import { ArtistGroupMembershipEntity } from "../InfraestructureLayer/database/Entities/ArtistGroupMembershipEntity";
import { AwardEntity } from "../InfraestructureLayer/database/Entities/AwardEntity";
import { BillboardListEntity } from "../InfraestructureLayer/database/Entities/BillboardListEntity";
import { ContractEntity } from "../InfraestructureLayer/database/Entities/ContractEntity";
import { Date } from "../InfraestructureLayer/database/Entities/DateEntity";
import { EvaluationEntity } from "../InfraestructureLayer/database/Entities/EvaluationEntity";
import { GroupActivityEntity } from "../InfraestructureLayer/database/Entities/GroupActivity";
import { GroupEntity } from "../InfraestructureLayer/database/Entities/GroupEntity";
import { IncomeEntity } from "../InfraestructureLayer/database/Entities/IncomeEntity";
import { IntervalEntity } from "../InfraestructureLayer/database/Entities/IntervalEntity";
import { PlaceEntity } from "../InfraestructureLayer/database/Entities/PlaceEntity";
import { SongBillboardEntity } from "../InfraestructureLayer/database/Entities/SongBillboardEntity";
import { SongEntity } from "../InfraestructureLayer/database/Entities/SongEntity";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "amsasc17",
      database: "kpop_management",
      entities: [UserOrmEntity, 
                UserOrmEntity,
        ResponsibleEntity,
        ActivityResponsibleEntity,
        ActivityDateEntity,
        ActivityEntity,
        ActivityPlaceEntity,
        AgencyEntity,
        AlbumEntity,
        ApprenticeEntity,
        ApprenticeEvaluationEntity,
        ArtistActivityEntity,
        ArtistAgencyMembershipEntity,
        ArtistCollaborationEntity,
        ArtistEntity,
        ArtistGroupCollaborationEntity,
        ArtistGroupMembershipEntity,
        AwardEntity,
        BillboardListEntity,
        ContractEntity,
        Date,
        EvaluationEntity,
        GroupActivityEntity,
        GroupEntity,
        IncomeEntity,
        IntervalEntity,
        PlaceEntity,
        SongBillboardEntity,
        SongEntity,
              ],
      synchronize: true, // Solo en desarrollo
      logging: true,
    }),
    // DatabaseModule,
    ResponsibleModule,
    AuthModule,
  ],

})
export class AppModule {}
