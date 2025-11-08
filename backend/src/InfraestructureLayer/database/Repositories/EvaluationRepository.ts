import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { BaseRepository } from './BaseRepositoryImpl';
import { EvaluationMapper } from "../Mappers/EvaluationMapper";
import { EvaluationEntity } from "@entities/EvaluationEntity";
import { Evaluation } from '@domain/Entities/Evaluation';
import { IEvaluationRepository } from '@domain/Repositories/IEvaluationRepository';

@Injectable()
export class EvaluationRepositoryImpl 
  extends BaseRepository<Evaluation, EvaluationEntity>
  implements IEvaluationRepository 
{
  constructor(
    @InjectRepository(EvaluationEntity)
    repository: Repository<EvaluationEntity>,
    mapper: EvaluationMapper
  ) {
    super(repository, mapper);
  }
}