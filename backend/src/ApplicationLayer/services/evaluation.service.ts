// apprentice-evaluation.service.ts
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IEvaluationRepository } from '@domain/Repositories/IEvaluationRepository';
import { ApprenticeEvaluationEntity } from '@infrastructure/database/Entities/ApprenticeEvaluationEntity';
import { CreateEvaluationDto } from '@application/DTOs/evaluationDto/create-evaluation.dto';
import { EvaluationResponseDto } from '@application/DTOs/evaluationDto/response-evaluation.dto';
import { UpdateEvaluationDto } from '@application/DTOs/evaluationDto/update-evaluation.dto';

@Injectable()
export class EvaluationService {
  constructor(
    @Inject(IEvaluationRepository)
    private readonly evaluationRepository: IEvaluationRepository,
  ) {}

  async create(createDto: CreateEvaluationDto): Promise<EvaluationResponseDto> {
    const evaluationEntity = new ApprenticeEvaluationEntity();
    evaluationEntity.apprenticeId = createDto.apprentice;
    evaluationEntity.dateId = createDto.date;
    evaluationEntity.evaluation = createDto.evaluation;

    
  console.log("=== DEBUG SERVICE ===");
  console.log("apprenticeId:", evaluationEntity.apprenticeId);
  console.log("dateId:", evaluationEntity.dateId);
  console.log("evaluation:", evaluationEntity.evaluation);


    const savedEntity = await this.evaluationRepository.save(evaluationEntity);
    return this.toResponseDto(savedEntity);
  }

  async findAll(): Promise<EvaluationResponseDto[]> {
    const entities = await this.evaluationRepository.findAll();
    return entities.map(entity => this.toResponseDto(entity));
  }

  async findByApprenticeId(apprenticeId: string): Promise<EvaluationResponseDto[]> {
    const entities = await this.evaluationRepository.findByApprenticeId(apprenticeId);
    return entities.map(entity => this.toResponseDto(entity));
  }

  async findByDateId(dateId: Date): Promise<EvaluationResponseDto[]> {
    const entities = await this.evaluationRepository.findByDateId(dateId);
    return entities.map(entity => this.toResponseDto(entity));
  }

  async findOne(apprenticeId: string, dateId: Date): Promise<EvaluationResponseDto> {
    const entity = await this.evaluationRepository.findById(apprenticeId, dateId);
    if (!entity) {
      throw new NotFoundException(`Evaluation not found for apprentice ${apprenticeId} and date ${dateId}`);
    }
    return this.toResponseDto(entity);
  }

  async update(
    apprenticeId: string, 
    dateId: Date, 
    updateDto: UpdateEvaluationDto
  ): Promise<EvaluationResponseDto> {

    console.log("=== DEBUG SERVICE ===");
    console.log("apprenticeId:", apprenticeId);
    console.log("dateId:", dateId);
    console.log("evaluation:", updateDto.evaluation);
    const entity = await this.evaluationRepository.findById(apprenticeId, dateId);
    
    if (!entity) {
      throw new NotFoundException(`Evaluation not found for apprentice ${apprenticeId} and date ${dateId}`);
    }

    // Actualizar solo los campos proporcionados
    if (updateDto.evaluation !== undefined) {
      entity.evaluation = updateDto.evaluation;
    }

    const updatedEntity = await this.evaluationRepository.update(entity);
    return this.toResponseDto(updatedEntity);
  }

  async remove(apprenticeId: string, dateId: Date): Promise<void> {
    const entity = await this.evaluationRepository.findById(apprenticeId, dateId);
    
    if (!entity) {
      throw new NotFoundException(`Evaluation not found for apprentice ${apprenticeId} and date ${dateId}`);
    }

    await this.evaluationRepository.delete(apprenticeId, dateId);
  }

  private toResponseDto(entity: ApprenticeEvaluationEntity): EvaluationResponseDto {
    return {
      apprentice: entity.apprenticeId,
      date: entity.dateId,
      evaluation: entity.evaluation,
    };
  }
}