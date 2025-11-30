// IApprenticeEvaluationRepository.ts
import { ApprenticeEvaluationEntity } from "@infrastructure/database/Entities/ApprenticeEvaluationEntity";
import { IRepository } from "./IRepository";

export abstract class IEvaluationRepository {
  abstract save(entity: ApprenticeEvaluationEntity): Promise<ApprenticeEvaluationEntity>;
  abstract findAll(): Promise<ApprenticeEvaluationEntity[]>;
  abstract findById(apprenticeId: string, dateId: Date): Promise<ApprenticeEvaluationEntity | null>;
  abstract findByApprenticeId(apprenticeId: string): Promise<ApprenticeEvaluationEntity[]>;
  abstract findByDateId(dateId: Date): Promise<ApprenticeEvaluationEntity[]>;
  abstract update(entity: ApprenticeEvaluationEntity): Promise<ApprenticeEvaluationEntity>;
  abstract delete(apprenticeId: string, dateId: Date): Promise<void>;
}