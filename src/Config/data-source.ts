import { DataSource } from 'typeorm';
import { AgencyEntity } from '@entities/AgencyEntity';
import { ApprenticeEntity } from '@entities/ApprenticeEntity';
import { ArtistEntity } from '@entities/ArtistEntity';
import { GroupEntity } from '@entities/GroupEntity';
import { ApprenticeEvaluationEntity } from '@entities/ApprenticeEvaluationEntity';
import { AlbumEntity } from '@entities/AlbumEntity';
import { ActivityDateEntity } from '@entities/ActivityDateEntity';
import { ActivityPlaceEntity } from '@entities/ActivityPlaceEntity';
import { ActivityResponsibleEntity } from '@entities/ActivityResponsibleEntity';
import { ArtistActivityEntity } from '@entities/ArtistActivityEntity';
import { ArtistAgencyMembershipEntity } from '@entities/ArtistAgencyMembershipEntity';
import { ArtistCollaborationEntity } from '@entities/ArtistCollaborationEntity';
import { AwardEntity } from '@entities/AwardEntity';
import { ArtistGroupCollaborationEntity } from '@entities/ArtistGroupCollaborationEntity';
import { ArtistGroupMembershipEntity } from '@entities/ArtistGroupMembershipEntity';
import { GroupActivityEntity } from '@entities/GroupActivity';
import { SongBillboardEntity } from '@entities/SongBillboardEntity';
import { ActivityEntity } from '@entities/ActivityEntity';
import { BillboardListEntity } from '@entities/BillboardListEntity';
import { ContractEntity } from '@entities/ContractEntity';
import { Date } from '@entities/DateEntity';
import { EvaluationEntity } from '@entities/EvaluationEntity';
import { IntervalEntity } from '@entities/IntervalEntity';
import { PlaceEntity } from '@entities/PlaceEntity';
import { ResponsibleEntity } from '@entities/ResponsibleEntity';
import { SongEntity } from '@entities/SongEntity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'amsasc17', 
  database: 'kpop_management',
  entities: [
    AgencyEntity,
    ApprenticeEntity, 
    ArtistEntity,
    GroupEntity,
    ApprenticeEvaluationEntity,
    AlbumEntity,
    AwardEntity,
    ActivityDateEntity,
    ActivityPlaceEntity,
    ActivityResponsibleEntity,
    ArtistActivityEntity,
    ArtistAgencyMembershipEntity,
    ArtistCollaborationEntity,
    ArtistGroupCollaborationEntity,
    ArtistGroupMembershipEntity,
    GroupActivityEntity,
    SongBillboardEntity,
    ActivityEntity,
    BillboardListEntity,
    ContractEntity,
    Date,
    EvaluationEntity,
    IntervalEntity,
    PlaceEntity,
    ResponsibleEntity,
    SongEntity
  ],
  migrations: ["src/Infraesttucture Layer/database/Migrations/**/*.ts"],
  synchronize: true,
  logging: true,
});