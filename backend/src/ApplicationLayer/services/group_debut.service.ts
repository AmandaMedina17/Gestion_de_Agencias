import { ActivityDtoMapper } from "@application/DTOs/dtoMappers/activity.dtoMapper";
import { ArtistDtoMapper } from "@application/DTOs/dtoMappers/artist.dtoMapper";
import { GroupDtoMapper } from "@application/DTOs/dtoMappers/group.dtoMapper";
import { CreateGroupDebutDto } from "@application/DTOs/group_debutDto/create-group-debut.dto";
import { GroupDebutResponseDto } from "@application/DTOs/group_debutDto/response-group-debut.dto";
import { CreateGroupDebutUseCase } from "@application/UseCases/create_group_debut.use-case";
import { IGroupRepository } from "@domain/Repositories/IGroupRepository";
import { Inject, Injectable } from "@nestjs/common";


@Injectable()
export class GroupDebutService{
  constructor(
    @Inject(IGroupRepository)
    private readonly groupRepository: IGroupRepository,
    private readonly groupDtoMapper: GroupDtoMapper,
    private readonly createGroupDebutUseCase: CreateGroupDebutUseCase,
    private readonly artistDtoMapper: ArtistDtoMapper,
    private readonly activityDtoMapper: ActivityDtoMapper,
    private readonly createGroupDebutDto: CreateGroupDebutDto,
  ) {}
  async createGroupDebut(createGroupDebutDto: CreateGroupDebutDto): Promise<GroupDebutResponseDto> {
    const {domainActivities, group} = await this.createGroupDebutUseCase.execute(createGroupDebutDto);
    const activities = this.activityDtoMapper.toResponseList(domainActivities);
    const groupDto = this.groupDtoMapper.toResponse(group);
    const response = new GroupDebutResponseDto();
    response.activities = activities;
    response.group = groupDto;
    return response;
    }
}