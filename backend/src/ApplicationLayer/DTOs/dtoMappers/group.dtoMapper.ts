import { Group } from "@domain/Entities/Group";
import { BaseDtoMapper } from "./DtoMapper";
import { CreateGroupDto } from "../groupDto/create-group.dto";
import { GroupResponseDto } from "../groupDto/response-group.dto";

export class GroupDtoMapper extends BaseDtoMapper<Group, CreateGroupDto, GroupResponseDto>{

    fromDto(dto: CreateGroupDto): Group {
        throw new Error('Group creation requires complex logic. Use CreateActivityUseCase instead.');
    }

    toResponse(domain: Group): GroupResponseDto {
        return {
            id: domain.getId(),
            name: domain.getName(),
            status: domain.getStatus(),
            debut_date: domain.getDebutDate(),
            members_num: domain.getNumberOfMembers(),
            visualconcept: domain.getVisualConcept(),
            concept: domain.getConcept(),
            is_created: domain.isCreated(),
            agencyID: domain.getAgency(),
            hasDebuted: domain.getHasDebuted()
        }
    }
}
