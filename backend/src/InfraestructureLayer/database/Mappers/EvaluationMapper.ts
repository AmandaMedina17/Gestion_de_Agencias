import { IMapper } from "./IMapper";
import { Evaluation } from "@domain/Entities/Evaluation";
import { EvaluationEntity } from "@entities/EvaluationEntity";

export class EvaluationMapper extends IMapper<Evaluation, EvaluationEntity>{
    
    toDomainEntity(dataBaseEntity: EvaluationEntity): Evaluation {
        return new Evaluation(
            dataBaseEntity.id,
            dataBaseEntity.date,
            dataBaseEntity.evaluation,
        );
    }
    toDataBaseEntity(domainEntity: Evaluation): EvaluationEntity {
        const entity = new EvaluationEntity();
        entity.id = domainEntity.getId();
        entity.date = domainEntity.getDate();
        entity.evaluation = domainEntity.getEvaluation();
        return entity;
    }
    
}