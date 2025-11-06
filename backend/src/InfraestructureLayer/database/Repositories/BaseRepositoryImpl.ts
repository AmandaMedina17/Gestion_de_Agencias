import { Injectable } from '@nestjs/common';
import { Repository, ObjectLiteral } from 'typeorm';
import { IRepository } from '@domain/Repositories/IRepository'
import { IMapper } from '../Mappers/IMapper';

@Injectable()
export class BaseRepository<
  DomainEntity,
  DataBaseEntity extends ObjectLiteral
> implements IRepository<DomainEntity> {
  
  constructor(
    protected readonly repository: Repository<DataBaseEntity>,
    private readonly mapper: IMapper<DomainEntity, DataBaseEntity>
  ) {}

  async findById(id: string): Promise<DomainEntity | null> {
    const dbEntity = await this.repository.findOne({ 
      where: { id } as any 
    });
    return dbEntity ? this.mapper.toDomainEntity(dbEntity) : null;
  }

  async findAll(): Promise<DomainEntity[]> {
    const dbEntities = await this.repository.find();
    return this.mapper.toDomainEntities(dbEntities);
  }

  async save(entity: DomainEntity): Promise<DomainEntity> {
    const dbEntity = this.mapper.toDataBaseEntity(entity);
    const savedEntity = await this.repository.save(dbEntity);
    return this.mapper.toDomainEntity(savedEntity);
  }

  async update(entity: DomainEntity): Promise<DomainEntity> {
    const dbEntity = this.mapper.toDataBaseEntity(entity);
    const updatedEntity = await this.repository.save(dbEntity);
    return this.mapper.toDomainEntity(updatedEntity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

}