import { IMapper } from "./IMapper";
import { Activity } from "@domain/Entities/Activity";
import { ActivityEntity } from "@entities/ActivityEntity";

export class ActivityMapper extends IMapper<Activity, ActivityEntity>{

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
}