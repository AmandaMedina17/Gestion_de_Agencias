import { IMapper } from "./IMapper";
import { Place } from "@domain/Entities/Place";
import { PlaceEntity } from "@entities/PlaceEntity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PlaceMapper extends IMapper<Place, PlaceEntity>{

    toDomainEntity(dataBaseEntity: PlaceEntity): Place {
        if (!dataBaseEntity) {
            throw new Error('Cannot map null entity to domain');
        }

        return new Place(
            dataBaseEntity.id,
            dataBaseEntity.place
        )
    }

    toDataBaseEntity(domainEntity: Place): PlaceEntity {
        const entity = new PlaceEntity();

        entity.id = domainEntity.getId();
        entity.place = domainEntity.getName();

        return entity;
    }
}