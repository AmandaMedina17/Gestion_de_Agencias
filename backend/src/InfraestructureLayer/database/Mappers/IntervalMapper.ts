// import { Interval } from '../../../DomainLayer/Entities/Interval';
// import { IntervalEntity} from '../Entities/IntervalEntity';
// import { DateValue } from "@domain/Value Objects/Values";
// import { IMapper } from "./IMapper";

// export class IntervalMapper extends IMapper<Interval, IntervalEntity> {
    
//     toDomainEntity(dataBaseEntity: IntervalEntity): Interval {
        
//         // Reconstruir el Value Object DateValue desde la fecha almacenada
//         const startDate = DateValue.fromString(
//         dataBaseEntity.startDate.toISOString().split('T')[0] // Formato YYYY-MM-DD
//         );
        
//         const endDate = DateValue.fromString(
//         dataBaseEntity.startDate.toISOString().split('T')[0] // Formato YYYY-MM-DD
//         );
    
//         return new Interval(
//                 dataBaseEntity.id,
//                 startDate,
//                 endDate
//               );
//     }
//     toDataBaseEntity(domainEntity: Interval): IntervalEntity {
//         const intervalEntity = new IntervalEntity();

//         intervalEntity.id = domainEntity.getId();
//         const startDate = domainEntity.getStartDate();
//         //intervalEntity.startDate= startDate.;

//         const endDate = domainEntity.getStartDate();
//         //intervalEntity.endDate= endDate.getValue();

//         return intervalEntity;
//     }
// }