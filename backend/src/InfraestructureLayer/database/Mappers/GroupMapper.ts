import { Group } from "@domain/Entities/Group";
import { IMapper } from "./IMapper";
import { GroupEntity } from "@infrastructure/database/Entities/GroupEntity";

export class GroupMapper extends IMapper<Group, GroupEntity>{
    
    toDomainEntity(dataBaseEntity: GroupEntity): Group {
        if(!dataBaseEntity)
        {
            throw new Error('Cannot map null entity to domain');
        }
        
        return new Group(
            dataBaseEntity.id,
            dataBaseEntity.name,
            dataBaseEntity.status,
            dataBaseEntity.debutDate,
            dataBaseEntity.concept,
            dataBaseEntity.is_created,
            dataBaseEntity.agencyId
        )
    }
    toDataBaseEntity(domainEntity: Group): GroupEntity {
        const entity = new GroupEntity();
        
        entity.id = domainEntity.getId();
        entity.name = domainEntity.getName();
        entity.status = domainEntity.getStatus();
        entity.debutDate = domainEntity.getDebutDate();
        entity.is_created = domainEntity.isCreated();
        entity.concept = domainEntity.getConcept()
        entity.agencyId = domainEntity.getAgency()
        
        return entity;
    }
}