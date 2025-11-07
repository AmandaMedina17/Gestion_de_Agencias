import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from './BaseRepositoryImpl';
import { Responsible } from '@domain/Entities/Responsible';
import { ResponsibleEntity } from '@entities/ResponsibleEntity';
import { ResponsibleMapper } from '../Mappers/ResponsibleMapper';
import { IResponsibleRepository } from '@domain/Repositories/IResponsibleRepository';

@Injectable()
export class ResponsibleRepository extends BaseRepository<Responsible,ResponsibleEntity> 
implements IResponsibleRepository{
  constructor(
    @InjectRepository(ResponsibleEntity)
    repository: Repository<ResponsibleEntity>,
    mapper: ResponsibleMapper
  ) {
    super(repository, mapper);
  }
}