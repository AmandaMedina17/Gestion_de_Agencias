import { IMapper } from "./IMapper";
import { ResponsibleEntity } from "@entities/ResponsibleEntity";
import { Responsible } from "@domain/Entities/Responsible";

class ResponsibleMapper implements IMapper<Responsible, ResponsibleEntity>{
    toDomainEntity(dataBaseEntity: ResponsibleEntity): Responsible {
        if(!dataBaseEntity)
        {
            throw new Error('Cannot map null entity to domain');
        }

        return new Responsible(
            dataBaseEntity.id,
            dataBaseEntity.name
        )
    }

    toDataBaseEntity(domainEntity: Responsible): ResponsibleEntity {
        const entity = new ResponsibleEntity();

        entity.id = domainEntity.getId();
        entity.name = domainEntity.getName();

        return entity;
    }

    toDataBaseEntities(domains: Responsible[]): ResponsibleEntity[] {
        return domains.map(domain => this.toDataBaseEntity(domain));
    }

    toDomainEntities(entities: ResponsibleEntity[]): Responsible[] {
        return entities.map(entity => this.toDomainEntity(entity));
    }
}