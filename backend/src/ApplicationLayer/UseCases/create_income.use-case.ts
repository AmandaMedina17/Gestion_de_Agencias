import { CreateIncomeDto } from "@application/DTOs/incomeDto/create-income.dto";
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

  async execute(incomeDto: CreateIncomeDto): Promise<Income> {
    // Verificar que la actividad existe
    const activity = await this.activityRepository.findById(incomeDto.activityId);
    if (!activity) {
      throw new Error(`Activity with id ${incomeDto.activityId} not found`);
    }

    // Verificar que la actividad no tenga ya un income
    const existingIncome = await this.incomeRepository.findByActivityId(incomeDto.activityId);
    if (existingIncome) {
      throw new Error(`Activity already has an income associated`);
    }

    // Crear el income con la misma activityId como parte de la PK
    const income = Income.create(
      incomeDto.activityId,
      incomeDto.type,
      incomeDto.mount,
      incomeDto.date,
      incomeDto.responsible
    );

    // Guardar el income
    return await this.incomeRepository.save(income);
  }
}