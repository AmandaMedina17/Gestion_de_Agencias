import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { IGroupRepository } from '@domain/Repositories/IGroupRepository';
import { GroupResponseDto } from '@application/DTOs/groupDto/response-group.dto';
import { GroupDtoMapper } from '@application/DTOs/dtoMappers/group.dtoMapper';
import { Group } from '@domain/Entities/Group';

@Injectable()
export class ActiveGroupUseCase {
  constructor(
    @Inject(IGroupRepository)
    private readonly groupRepository: IGroupRepository,
    private readonly groupDtoMapper: GroupDtoMapper
  ) {}

  async execute(groupId: string): Promise<Group> {
    const groupEntity = await this.groupRepository.findById(groupId);
    if(groupEntity)
    {
        groupEntity.set_created();
        this.groupRepository.save(groupEntity);
        return groupEntity;
    }
    throw new Error("Cannot find the group with id " + {groupId})
    
  }
}