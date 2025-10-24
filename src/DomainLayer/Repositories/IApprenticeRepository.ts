import { ApprenticeID } from "../Value Objects/IDs";
import { ApprenticeEntity } from "../Entities/Apprentice";
import { EvaluationEntity } from "../Entities/Evaluation";
import { IRepository } from "./IRepository";

export interface IApprenticeRepository
  extends IRepository<ApprenticeEntity, ApprenticeID> {
  getApprenticeEvaluations(id: ApprenticeID): Promise<EvaluationEntity[]>;
}
