import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Income } from '@domain/Entities/Income';
import { IncomeEntity } from '../Entities/IncomeEntity';
import { BaseRepository } from './BaseRepositoryImpl';
import { IncomeRepository } from '@domain/Repositories/IncomeRepository';
import { IncomeMapper } from '../Mappers/IncomeMapper';

@Injectable()
export class IncomeRepositoryImpl extends BaseRepository<Income,IncomeEntity> 
implements IncomeRepository{
  constructor(
    @InjectRepository(IncomeEntity)
    repository: Repository<IncomeEntity>,
    mapper: IncomeMapper,
  ) {
    super(repository, mapper);
  }
  
  async findByActivityId(activityId: string): Promise<Income | null> {
    const entity = await this.repository.findOne({
      where: { activityID: activityId } 
    });
    
    return entity ? this.mapper.toDomainEntity(entity) : null;
  }

  async delete(id: string): Promise<void> {
    throw new Error(
      'No se puede eliminar el ingreso directamente. ' +
      'Elimine la actividad asociada para que el ingreso se borre automáticamente.'
    );
  }

}