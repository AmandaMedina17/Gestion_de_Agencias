import { Income } from "@domain/Entities/Income";
import { IActivityRepository } from "@domain/Repositories/IActivityRepository";
import { IncomeRepository } from "@domain/Repositories/IncomeRepository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateIncomeUseCase {
  constructor(
    private readonly incomeRepository: IncomeRepository,
    private readonly activityRepository: IActivityRepository
  ) {}

  async execute(incomeProps: any): Promise<Income> {
    // Verificar que la actividad existe
    const activity = await this.activityRepository.findById(incomeProps.activityId);
    if (!activity) {
      throw new Error(`Activity with id ${incomeProps.activityId} not found`);
    }

    // Verificar que la actividad no tenga ya un income
    const existingIncome = await this.incomeRepository.findByActivityId(incomeProps.activityId);
    if (existingIncome) {
      throw new Error(`Activity already has an income associated`);
    }

    // Crear el income con la misma activityId como parte de la PK
    const income = Income.create(
      incomeProps.activityId,
      incomeProps.type,
      incomeProps.mount,
      incomeProps.date,
      incomeProps.responsible
    );

    // Guardar el income
    return await this.incomeRepository.save(income);
  }
}