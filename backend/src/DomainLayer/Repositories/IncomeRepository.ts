import { IRepository } from "./IRepository";
import { Income } from "@domain/Entities/Income";

export abstract class IncomeRepository extends IRepository<Income> {
    abstract findByActivityId(activityId: string): Promise<Income | null>;
}