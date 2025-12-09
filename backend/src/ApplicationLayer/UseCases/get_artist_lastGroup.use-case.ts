import { GroupResponseDto } from "@application/DTOs/groupDto/response-group.dto";
import { createQueryBuilder } from "typeorm";

export class GetArtistLastGroupUseCase {
    constructor() {}

    async execute(idArtist: string) : Promise<GroupResponseDto>{
        .createQueryBuilder('artist')
        .leftJoinAndSelect('artist.groupMemberships', 'membership')
        .leftJoinAndSelect('membership.group', 'group')
        .leftJoinAndSelect('group.agency', 'agency')
        .where('artist.id = :artistId', {idArtist})
        .orderBy('CASE WHEN membership.endDate IS NULL THEN 0 ELSE 1 END', 'ASC')
        .addOrderBy('membership.startDate', 'DESC')
        .getOne();

        return 0
    }
}