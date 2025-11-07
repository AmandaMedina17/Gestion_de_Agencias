import { IMapper } from "./IMapper";
import { Evaluation } from "@domain/Entities/Evaluation";
import { EvaluationEntity } from "@entities/EvaluationEntity";

class EvaluationMapper implements IMapper<Evaluation, EvaluationEntity>{
    toDomainEntities(entities: EvaluationEntity[]): Evaluation[] {
        throw new Error("Method not implemented.");
    }
    toDataBaseEntities(domains: Evaluation[]): EvaluationEntity[] {
        throw new Error("Method not implemented.");
    }
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