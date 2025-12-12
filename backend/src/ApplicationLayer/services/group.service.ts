import { Inject, Injectable } from "@nestjs/common"
import { BaseService } from "./base.service"
import { Group } from "@domain/Entities/Group"
import { CreateGroupDto } from "@application/DTOs/groupDto/create-group.dto"
import { GroupResponseDto } from "@application/DTOs/groupDto/response-group.dto"
import { UpdateGroupDto } from "@application/DTOs/groupDto/update-group.dto"
import { CreateGroupUseCase } from "@application/UseCases/create_group.use-case"
import { GroupDtoMapper } from "@application/DTOs/dtoMappers/group.dtoMapper"
import { IGroupRepository } from "@domain/Repositories/IGroupRepository"
import { UpdateGroupUseCase } from "@application/UseCases/update_group.use-case"
import { AddMemberToGroupDto } from "@application/DTOs/membershipDto/add-member-to-group.dto"
import { AddMemberToGroupUseCase } from "@application/UseCases/add_member_to_group.use-case"
import { ArtistResponseDto } from "@application/DTOs/artistDto/response-artist.dto"
import { ArtistDtoMapper } from "@application/DTOs/dtoMappers/artist.dtoMapper"
import { LeaveGroupDto } from "@application/DTOs/membershipDto/leave-group.dto"
import { LeaveGroupUseCase } from "@application/UseCases/leave-group.use-case"
import { ActiveGroupUseCase } from "@application/UseCases/activate_group.use-case"

@Injectable()
export class GroupService
extends BaseService<Group, CreateGroupDto, GroupResponseDto , UpdateGroupDto> {

  constructor(
    @Inject(IGroupRepository)
    private readonly groupRepository: IGroupRepository,
    private readonly groupDtoMapper: GroupDtoMapper,
    private readonly create_group_usecase: CreateGroupUseCase,
    private readonly update_group_usecase: UpdateGroupUseCase,
    private readonly add_member_to_group_usecase: AddMemberToGroupUseCase,
    private readonly remove_member_usecase: LeaveGroupUseCase,
    private readonly activate_group_usecase: ActiveGroupUseCase,
    private readonly artistDtoMapper: ArtistDtoMapper
  ) {
    super(groupRepository, groupDtoMapper)
  }

  async create(createGroupDto: CreateGroupDto): Promise<GroupResponseDto> {
    const savedEntity = await this.create_group_usecase.execute(createGroupDto)
    return this.mapper.toResponse(savedEntity)
  }

  async update(id: string, updateGroupDto: UpdateGroupDto): Promise<GroupResponseDto>{
    const savedEntity = await this.update_group_usecase.execute(id, updateGroupDto)
    return this.mapper.toResponse(savedEntity)
  }

  async addMember(addMemberDto: AddMemberToGroupDto) {
    return await this.add_member_to_group_usecase.execute(addMemberDto);
  }

  async removeMember(removeMemberDto: LeaveGroupDto) {
    return await this.remove_member_usecase.execute(removeMemberDto);
  }

  async getGroupMembers(groupId: string): Promise<ArtistResponseDto[]> {
    const members = await this.groupRepository.getGroupMembers(groupId)
    return this.artistDtoMapper.toResponseList(members)
  }

  async getNotCreatedGroups(){
    const groups = await this.groupRepository.findAll();
    const created_groups = groups.filter(group => group.isCreated() === false);
    return this.groupDtoMapper.toResponseList(created_groups);
  }

  async activateGroup(groupId: string){
    const activatedGroup = this.activate_group_usecase.execute(groupId);
  }
}
