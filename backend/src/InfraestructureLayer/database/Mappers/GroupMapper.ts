import { Group } from "@domain/Entities/Group";
import { IMapper } from "./IMapper";
import { GroupEntity } from "@entities/GroupEntity";

export class GroupMapper extends IMapper<Group, GroupEntity>{
    
    toDomainEntity(dataBaseEntity: GroupEntity): Group {
        throw new Error("Method not implemented.");
    }
    toDataBaseEntity(domainEntity: Group): GroupEntity {
        throw new Error("Method not implemented.");
    }
}