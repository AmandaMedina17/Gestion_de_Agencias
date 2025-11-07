import { Interval } from '../../../DomainLayer/Entities/Interval';
import { IntervalEntity} from '../Entities/IntervalEntity';
import { DateValue } from "@domain/Value Objects/Values";
import { IMapper } from "./IMapper";

export class IntervalMapper implements IMapper<Interval, IntervalEntity> {
    toDomainEntities(entities: IntervalEntity[]): Interval[] {
        return entities.map(entity => this.toDomainEntity(entity));
    }
    toDataBaseEntities(domains: Interval[]): IntervalEntity[] {
         return domains.map(domain => this.toDataBaseEntity(domain));
    }
    toDomainEntity(dataBaseEntity: IntervalEntity): Interval {
        
        // Reconstruir el Value Object DateValue desde la fecha almacenada
        const startDate = DateValue.fromString(
        dataBaseEntity.startDate.toISOString().split('T')[0] // Formato YYYY-MM-DD
        );
        
        const endDate = DateValue.fromString(
        dataBaseEntity.startDate.toISOString().split('T')[0] // Formato YYYY-MM-DD
        );
    
        return new Interval(
                dataBaseEntity.id,
                startDate,
                endDate
              );
    }
    toDataBaseEntity(domainEntity: Interval): IntervalEntity {
        const intervalEntity = new IntervalEntity();

        intervalEntity.id = domainEntity.getId();
        const startDate = domainEntity.getStartDate();
        intervalEntity.startDate= startDate.getValue();

        const endDate = domainEntity.getStartDate();
        intervalEntity.endDate= endDate.getValue();

        return intervalEntity;
    }


}