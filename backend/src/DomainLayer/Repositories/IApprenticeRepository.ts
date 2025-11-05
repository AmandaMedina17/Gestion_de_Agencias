import { Apprentice } from "../Entities/Apprentice";
import { Evaluation } from "../Entities/Evaluation";
import { IRepository } from "./IRepository";

export interface IApprenticeRepository
  extends IRepository<Apprentice, string> {
  getApprenticeEvaluations(id: string): Promise<Evaluation[]>;
}
