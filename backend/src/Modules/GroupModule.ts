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
import { LeaveGroupUseCase } from '@application/UseCases/leave-group.use-case';
import { IArtistGroupMembershipRepository } from '@domain/Repositories/IArtistGroupMembershipRepository';
import { ArtistGroupMembershipRepository } from '@infrastructure/database/Repositories/ArtistGroupMembershipRepository';
import { ActiveGroupUseCase } from '@application/UseCases/activate_group.use-case';

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
    {
      provide: IArtistGroupMembershipRepository,
      useClass: ArtistGroupMembershipRepository
    },
    CreateGroupUseCase,
    UpdateGroupUseCase,
    AddMemberToGroupUseCase,
    LeaveGroupUseCase,
    ActiveGroupUseCase,
    ],
    exports: [
    IGroupRepository,
    GroupDtoMapper,
    GroupMapper,
    IArtistGroupMembershipRepository]
})
export class GroupModule {}

