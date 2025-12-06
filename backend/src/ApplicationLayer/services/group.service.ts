import { Inject, Injectable } from "@nestjs/common"
import { BaseService } from "./base.service"
import { Group } from "@domain/Entities/Group"
import { CreateGroupDto } from "@application/DTOs/groupDto/create-group.dto"
import { GroupResponseDto } from "@application/DTOs/groupDto/response-group.dto"
import { UpdateGroupDto } from "@application/DTOs/groupDto/update-group.dto"
import { CreateGroupUseCase } from "@application/UseCases/create_group.use-case"
import { GroupDtoMapper } from "@application/DTOs/dtoMappers/group.dtoMapper"
import { IGroupRepository } from "@domain/Repositories/IGroupRepository"

@Injectable()
export class GroupService
extends BaseService<Group, CreateGroupDto, GroupResponseDto , UpdateGroupDto> {

  constructor(
    @Inject(IGroupRepository)
    private readonly groupRepository: IGroupRepository,
    private readonly groupDtoMapper: GroupDtoMapper,
    private readonly create_group_usecase: CreateGroupUseCase
  ) {
    super(groupRepository, groupDtoMapper)
  }

  async create(createGroupDto: CreateGroupDto): Promise<GroupResponseDto> {
    const savedEntity = await this.create_group_usecase.execute(createGroupDto)
    return this.mapper.toResponse(savedEntity)
  }
}
