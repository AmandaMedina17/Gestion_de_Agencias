import { Group } from "@domain/Entities/Group";
import { IAgencyRepository } from "@domain/Repositories/IAgencyRepository";
import { IGroupRepository } from "@domain/Repositories/IGroupRepository";
import { Inject, Injectable } from "@nestjs/common";
import { CreateGroupDto } from "@application/DTOs/groupDto/create-group.dto";

@Injectable()
export class CreateGroupUseCase {
  constructor(
    @Inject(IGroupRepository)
    private readonly groupRepository: IGroupRepository,
    @Inject(IAgencyRepository)
    private readonly agencyRepository: IAgencyRepository,
  ) {}

  async execute(groupDto: CreateGroupDto): Promise<Group> {
    
    const agency = await this.agencyRepository.findById(groupDto.agencyId);
    if (!agency) {
      throw new Error(`agency with id ${groupDto.agencyId} not found`);
    }

    const group = Group.create(
        groupDto.name,
        groupDto.status,
        groupDto.debut_date,
        groupDto.concept,
        groupDto.is_created,
        groupDto.agencyId
    )
    
    return await this.groupRepository.save(group);
  }
}