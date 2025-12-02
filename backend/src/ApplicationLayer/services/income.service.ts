import { Inject, Injectable } from "@nestjs/common"
import { BaseService } from "./base.service"
import { Income } from "@domain/Entities/Income"
import { CreateIncomeDto } from "@application/DTOs/incomeDto/create-income.dto"
import { IncomeResponseDto } from "@application/DTOs/incomeDto/response-income.dto"
import { UpdateIncomeDto } from "@application/DTOs/incomeDto/update-income.dto"
import { IncomeRepository } from "@domain/Repositories/IncomeRepository"
import { IncomeDtoMapper } from "@application/DTOs/dtoMappers/income.dtoMapper"
import { CreateIncomeUseCase } from "@application/UseCases/create_income.use-case"

@Injectable()
export class IncomeService
extends BaseService<Income, CreateIncomeDto, IncomeResponseDto , UpdateIncomeDto> {

  constructor(
    @Inject(IncomeRepository)
    private readonly incomeRepository: IncomeRepository,
    private readonly incomeDtoMapper: IncomeDtoMapper,
    private readonly create_income_usecase: CreateIncomeUseCase
  ) {
    super(incomeRepository, incomeDtoMapper)
  }

  async create(createIncomeDto: CreateIncomeDto): Promise<IncomeResponseDto> {
    const savedEntity = await this.create_income_usecase.execute(createIncomeDto)
    return this.mapper.toResponse(savedEntity)
  }
}