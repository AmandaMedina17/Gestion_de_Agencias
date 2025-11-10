import { IMapper } from "./IMapper";
import { Evaluation } from "@domain/Entities/Evaluation";
import { EvaluationEntity } from "@entities/EvaluationEntity";

export class EvaluationMapper implements IMapper<Evaluation, EvaluationEntity>{
    toDomainEntities(entities: EvaluationEntity[]): Evaluation[] {
        return entities.map(entity => this.toDomainEntity(entity));
    }
    toDataBaseEntities(domains: Evaluation[]): EvaluationEntity[] {
        return domains.map(domain => this.toDataBaseEntity(domain));
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