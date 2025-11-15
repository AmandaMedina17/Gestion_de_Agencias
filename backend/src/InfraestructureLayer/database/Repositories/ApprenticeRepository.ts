import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { BaseRepository } from './BaseRepositoryImpl';
import { IApprenticeRepository } from '@domain/Repositories/IApprenticeRepository';
import { Apprentice } from '@domain/Entities/Apprentice';
import { ApprenticeMapper } from '../Mappers/ApprenticeMapper';
import { ApprenticeEntity } from '../Entities/ApprenticeEntity';
import { Evaluation } from '@domain/Entities/Evaluation';
@Injectable()
export class ApprenticeRepository
  extends BaseRepository<Apprentice, ApprenticeEntity>
  implements IApprenticeRepository 
{
  constructor(
    @InjectRepository(ApprenticeEntity)
    repository: Repository<ApprenticeEntity>,
    mapper: ApprenticeMapper,
  ) {
    super(repository, mapper);
  }
  async getApprenticeEvaluations(id: string): Promise<Evaluation[]> {
    const apprenticeEntity = await this.repository.findOne({
      where: { id },
      relations: ['apprenticeEvaluations', 'apprenticeEvaluations.evaluation']
    });

    if (!apprenticeEntity) {
      throw new Error(`Apprentice with id ${id} not found`);
    }

    if (!apprenticeEntity.apprenticeEvaluations) {
      return [];
    }

    // Mapeamos las EvaluationEntity a Evaluation (dominio)
    return apprenticeEntity.apprenticeEvaluations.map(ae => {
      const evaluationEntity = ae.evaluation;
      // Aquí necesitarías un EvaluationMapper, por ahora creación manual
      return new Evaluation(
        evaluationEntity.id,
        evaluationEntity.date,
        evaluationEntity.evaluation
      );
    });
  }

}