import { CreateGroupDebutUseCase } from '@application/UseCases/create_group_debut.use-case';
import { ActivityDtoMapper } from '@application/DTOs/dtoMappers/activity.dtoMapper';
import { ActivityModule } from './ActivityModule';
import { PlaceDtoMapper } from '@application/DTOs/dtoMappers/place.dtoMapper';
import { ResponsibleModule } from './ResponsibleModule';
import { PlaceModule } from './PlaceModule';
import { GroupActivityModule } from './GroupActivityModule';
import { GroupActivityRepository } from '@infrastructure/database/Repositories/GroupActivityRepository';
import { GroupActivityEntity } from '@infrastructure/database/Entities/GroupActivity';
import { ActivityMapper } from '@infrastructure/database/Mappers/ActivityMapper';
import { ArtistActivityModule } from './ArtistActivityModule';
import { GroupRepository } from '@infrastructure/database/Repositories/GroupRepository';
import { IGroupRepository } from '@domain/Repositories/IGroupRepository';
import { GroupEntity } from '@infrastructure/database/Entities/GroupEntity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { GroupDebutController } from '@presentation/Controllers/group-debut.controller';
import { GroupModule } from './GroupModule';
import { ArtistModule } from './ArtistModule';
import { ArtistGroupMembershipEntity } from '@infrastructure/database/Entities/ArtistGroupMembershipEntity';
import { GroupDebutService } from '@application/services/group_debut.service';
import { CreateGroupDebutDto } from '@application/DTOs/group_debutDto/create-group-debut.dto';
import { AlbumModule } from './album/album.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupEntity, GroupActivityEntity, ArtistGroupMembershipEntity, ]),
    ActivityModule,
    ResponsibleModule,
    PlaceModule,
    ArtistActivityModule,
    GroupModule,
    ArtistModule,
    GroupActivityModule,
    AlbumModule,
  ],
  controllers: [GroupDebutController],
  providers: [
    GroupDebutService,
    CreateGroupDebutDto,
    {
      provide: IGroupRepository,    
      useClass: GroupRepository
    },
    CreateGroupDebutUseCase,
    ],
    exports: [
    IGroupRepository,]
})
export class GroupDebutModule {}