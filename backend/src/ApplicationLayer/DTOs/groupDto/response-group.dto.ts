import { GroupStatus } from "../../../DomainLayer/Enums";

export class GroupResponseDto{
    id!: string;
    name!: string;
    status!: GroupStatus;
    debut_date!: Date;
    members_num!: number;
    concept!: string;
    is_created!: boolean;
    agencyID!: string;
}