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

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupEntity]),
    AgencyModule
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
    CreateGroupUseCase
    ],
    exports: [
    IGroupRepository,
    GroupDtoMapper,
    GroupMapper]
})
export class GroupModule {}

