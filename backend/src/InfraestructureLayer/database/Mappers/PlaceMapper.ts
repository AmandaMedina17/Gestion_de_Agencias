import { IMapper } from "./IMapper";
import { Place } from "@domain/Entities/Place";
import { PlaceEntity } from "@entities/PlaceEntity";

class PlaceMapper implements IMapper<Place, PlaceEntity>{

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

    toDomainEntities(entities: PlaceEntity[]): Place[] {
            return entities.map(entity => this.toDomainEntity(entity));
        }
    
        toDataBaseEntities(domains: Place[]): PlaceEntity[] {
            return domains.map(domain => this.toDataBaseEntity(domain));
        }
}