import { IMapper } from "./IMapper";
import { Activity } from "@domain/Entities/Activity";
import { ActivityEntity } from "@entities/ActivityEntity";

class ActivityMapper implements IMapper<Activity, ActivityEntity>{

    toDomainEntity(dataBaseEntity: ActivityEntity): Activity {
        if (!dataBaseEntity) {
            throw new Error('Cannot map null entity to domain');
        }

        return new Activity(
            dataBaseEntity.id,
            dataBaseEntity.classification,
            dataBaseEntity.type
        )
    }

    toDataBaseEntity(domainEntity: Activity): ActivityEntity {
        const entity = new ActivityEntity();

        entity.id = domainEntity.getId();
        entity.classification = domainEntity.getClassification();
        entity.type = domainEntity.getType();
        
        return entity;
    }

    toDomainEntities(entities: ActivityEntity[]): Activity[] {
        return entities.map(entity => this.toDomainEntity(entity));
    }

    toDataBaseEntities(domains: Activity[]):ActivityEntity[] {
        return domains.map(domain => this.toDataBaseEntity(domain));
    }
}