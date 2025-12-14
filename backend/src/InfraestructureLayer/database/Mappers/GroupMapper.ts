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
            dataBaseEntity.agencyId,
            dataBaseEntity.num_members,
            dataBaseEntity.visualconcept,
            dataBaseEntity.proposedByArtistId
        )
    }

    toDomainEntityWithMembers(entity: GroupEntity, members: string[]): Group {
        if(!entity)
        {
            throw new Error('Cannot map null entity to domain');
        }

        return new Group(
            entity.id,
            entity.name,
            entity.status,
            entity.debutDate,
            entity.concept,
            entity.is_created,
            entity.agencyId,
            entity.num_members,
            entity.visualconcept,
            entity.proposedByArtistId,
            members
        );
    }

    toDataBaseEntity(domainEntity: Group): GroupEntity {
        const entity = new GroupEntity();
        
        entity.id = domainEntity.getId();
        entity.name = domainEntity.getName();
        entity.num_members = domainEntity.getNumberOfMembers();
        entity.status = domainEntity.getStatus();
        entity.debutDate = domainEntity.getDebutDate();
        entity.is_created = domainEntity.isCreated();
        entity.concept = domainEntity.getConcept()
        entity.agencyId = domainEntity.getAgency()
        entity.visualconcept = domainEntity.getVisualConcept();
        entity.proposedByArtistId = domainEntity.getProposedByArtistId();
        
        return entity;
    }
}