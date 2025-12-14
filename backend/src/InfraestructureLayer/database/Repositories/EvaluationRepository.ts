import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IEvaluationRepository } from '@domain/Repositories/IEvaluationRepository';
import { ApprenticeEvaluationEntity } from '@infrastructure/database/Entities/ApprenticeEvaluationEntity';

@Injectable()
export class EvaluationRepository implements IEvaluationRepository {
  constructor(
    @InjectRepository(ApprenticeEvaluationEntity)
    private readonly repository: Repository<ApprenticeEvaluationEntity>,
  ) {}

  async save(entity: ApprenticeEvaluationEntity): Promise<ApprenticeEvaluationEntity> {
    console.log(entity.apprentice);
    console.log(entity.dateId);
    console.log(entity.evaluation);
    return this.repository.save(entity);
  }

  async findAll(): Promise<ApprenticeEvaluationEntity[]> {
    return this.repository.find();
  }

  async findById(apprenticeId: string, dateId: Date): Promise<ApprenticeEvaluationEntity | null> {
    return this.repository.findOne({
      where: { apprenticeId, dateId }
    });
  }

  async findByApprenticeId(apprenticeId: string): Promise<ApprenticeEvaluationEntity[]> {
    return this.repository.find({
      where: { apprenticeId }
    });
  }

  async findByDateId(dateId: Date): Promise<ApprenticeEvaluationEntity[]> {
    return this.repository.find({
      where: { dateId }
    });
  }

  async update(entity: ApprenticeEvaluationEntity): Promise<ApprenticeEvaluationEntity> {
    console.log("=== DEBUG REPOSITORY ===");
    console.log("apprenticeId:", entity.apprenticeId);
    console.log("dateId:", entity.dateId);
    console.log("evaluation:", entity.evaluation);
    return this.repository.save(entity);
  }

  async delete(apprenticeId: string, dateId: Date): Promise<void> {
    await this.repository.delete({ apprenticeId, dateId });
  }
}