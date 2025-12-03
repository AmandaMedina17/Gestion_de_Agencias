import { IMapper } from "./IMapper";
import { Activity } from "@domain/Entities/Activity";
import { ActivityEntity } from "@infrastructure/database/Entities/ActivityEntity";
import { ResponsibleMapper } from "./ResponsibleMapper";
import { PlaceMapper } from "./PlaceMapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ActivityMapper extends IMapper<Activity, ActivityEntity>{

    constructor(
        private readonly responsibleMapper: ResponsibleMapper,
        private readonly placeMapper: PlaceMapper
    ){
    super()
    }

    toDomainEntity(dataBaseEntity: ActivityEntity): Activity {
        if (!dataBaseEntity) {
            throw new Error('Cannot map null entity to domain');
        }
        return new Activity(
            dataBaseEntity.id,
            dataBaseEntity.classification,
            dataBaseEntity.type,
        )
    }

    toDomainWithRelations(dataBaseEntity: ActivityEntity): Activity {
        if (!dataBaseEntity) {
            throw new Error('Cannot map null entity to domain');
        }

        const responsibles = dataBaseEntity.activityResponsibles?.map(ar => 
            this.responsibleMapper.toDomainEntity(ar.responsible)
        ) || [];

        const places = dataBaseEntity.activityPlaces?.map(ap => 
            this.placeMapper.toDomainEntity(ap.place)
        ) || [];

        const dates = dataBaseEntity.activityDates?.map(ad => 
            ad.date
        ) || [];

        return new Activity(
            dataBaseEntity.id,
            dataBaseEntity.classification,
            dataBaseEntity.type,
            responsibles,
            places,
            dates
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