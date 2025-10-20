// Infraestructure Layer/Entities/config/data-source.ts
import { DataSource } from 'typeorm';
import { AgencyEntity } from '../AgencyEntity';
import { ApprenticeEntity } from '../ApprenticeEntity';
import { ArtistEntity } from '../ArtistEntity';
import { GroupEntity } from '../GroupEntity';
import { ApprenticeEvaluationEntity } from '../Many To Many/ApprenticeEvaluationEntity';
import { AlbumEntity } from '../AlbumEntity';
import { ActivityDateEntity } from '../Many To Many/ActivityDateEntity';
import { ActivityPlaceEntity } from '../Many To Many/ActivityPlaceEntity';
import { ActivityResponsibleEntity } from '../Many To Many/ActivityResponsibleEntity';
import { ArtistActivityEntity } from '../Many To Many/ArtistActivityEntity';
import { ArtistAgencyMembershipEntity } from '../Many To Many/ArtistAgencyMembershipEntity';
import { ArtistCollaborationEntity } from '../Many To Many/ArtistCollaborationEntity';
import { AwardEntity } from '../AwardEntity';
import { ArtistGroupCollaborationEntity } from '../Many To Many/ArtistGroupCollaborationEntity';
import { ArtistGroupMembershipEntity } from '../Many To Many/ArtistGroupMembershipEntity';
import { GroupActivityEntity } from '../Many To Many/GroupActivity';
import { SongBillboardEntity } from '../Many To Many/SongBillboardEntity';
import { ActivityEntity } from '../ActivityEntity';
import { BillboardListEntity } from '../BillboardListEntity';
import { ContractEntity } from '../ContractEntity';
import { Date } from '../DateEntity';
import { EvaluationEntity } from '../EvaluationEntity';
import { IntervalEntity } from '../IntervalEntity';
import { PlaceEntity } from '../PlaceEntity';
import { ResponsibleEntity } from '../ResponsibleEntity';
import { SongEntity } from '../SongEntity';

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
  synchronize: true,
  logging: true,
});