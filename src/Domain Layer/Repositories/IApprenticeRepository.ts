import { ApprenticeID } from "../Value Objects/IDs";
import { ApprenticeEntity } from "../Entities/ApprenticeEntity";
import { EvaluationEntity } from "../Entities/EvaluationEntity";
import { IRepository } from "./IRepository";

export interface IApprenticeRepository extends IRepository<ApprenticeEntity,ApprenticeID>
{
    getApprenticeEvaluations(id: ApprenticeID): Promise<EvaluationEntity[]>;
}