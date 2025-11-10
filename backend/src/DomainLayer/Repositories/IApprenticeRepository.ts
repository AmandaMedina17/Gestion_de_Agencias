import { Apprentice } from "../Entities/Apprentice";
import { Evaluation } from "../Entities/Evaluation";
import { IRepository } from "./IRepository";

export abstract class IApprenticeRepository
  extends IRepository<Apprentice> {
  abstract getApprenticeEvaluations(id: string): Promise<Evaluation[]>;
}
