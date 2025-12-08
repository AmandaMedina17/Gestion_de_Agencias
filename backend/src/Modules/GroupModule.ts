import { Module } from '@nestjs/common';
import { GroupService } from '@application/services/group.service';
import { GroupController } from '../PresentationLayer/Controllers/group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from '@infrastructure/database/Entities/GroupEntity';
import { GroupMapper } from '@infrastructure/database/Mappers/GroupMapper';
import { GroupDtoMapper } from '@application/DTOs/dtoMappers/group.dtoMapper';
import { AgencyModule } from './AgencyModule';
import { IGroupRepository } from '@domain/Repositories/IGroupRepository';
import { GroupRepository } from '@infrastructure/database/Repositories/GroupRepository';
import { CreateGroupUseCase } from '@application/UseCases/create_group.use-case';
import { UpdateGroupUseCase } from '@application/UseCases/update_group.use-case';
import { AddMemberToGroupUseCase } from '@application/UseCases/add_member_to_group.use-case';
import { ArtistModule } from './ArtistModule';
import { ArtistGroupMembershipEntity } from '@infrastructure/database/Entities/ArtistGroupMembershipEntity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupEntity, ArtistGroupMembershipEntity]),
    AgencyModule,
    ArtistModule
  ],
  controllers: [GroupController],
  providers: [
    GroupService,
    GroupMapper,
    GroupDtoMapper,
    {
      provide: IGroupRepository,    
      useClass: GroupRepository
    },
    CreateGroupUseCase,
    UpdateGroupUseCase,
    AddMemberToGroupUseCase
    ],
    exports: [
    IGroupRepository,
    GroupDtoMapper,
    GroupMapper]
})
export class GroupModule {}

