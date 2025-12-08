import { Group } from "@domain/Entities/Group";
import { IAgencyRepository } from "@domain/Repositories/IAgencyRepository";
import { IGroupRepository } from "@domain/Repositories/IGroupRepository";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { UpdateGroupDto } from "@application/DTOs/groupDto/update-group.dto";

@Injectable()
export class UpdateGroupUseCase {
  constructor(
    @Inject(IGroupRepository)
    private readonly groupRepository: IGroupRepository,
    @Inject(IAgencyRepository)
    private readonly agencyRepository: IAgencyRepository,
  ) {}

  async execute(groupId: string, groupDto: UpdateGroupDto): Promise<Group> {

    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw new NotFoundException(`Group with id ${groupId} not found`);
    }
    
    if(groupDto.agencyId)
    {
        const agency = await this.agencyRepository.findById(groupDto.agencyId);
        if (!agency) {
            throw new Error(`agency with id ${groupDto.agencyId} not found`);
        }
    }
    
    group.update(groupDto)
    
    return await this.groupRepository.update(group);
  }
}