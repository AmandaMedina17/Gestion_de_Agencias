
import { Repository, ObjectLiteral } from 'typeorm';
import { IBaseRepository } from '../../../Domain Layer/Repositories/IBaseRepository';
import { IMapper } from '../IMapper';
import {AppDataSource} from '../../../ormconfig';

export class GenericTypeOrmRepository<
  DomainEntity,
  DataBaseEntity extends ObjectLiteral
> implements IBaseRepository<DomainEntity> {
  
  protected repository: Repository<DataBaseEntity>;
  
  constructor(
    private entityClass: new () => DataBaseEntity,
    private mapper: IMapper<DomainEntity, DataBaseEntity>
  ) {
    this.repository = AppDataSource.getRepository(entityClass);
  }

  async create(entity: DomainEntity): Promise<DomainEntity> {
    const model = this.mapper.toDataBaseEntity(entity);
    const savedModel = await this.repository.save(model);
    return this.mapper.toDomainEntity(savedModel);
  }

  async findById(id: string): Promise<DomainEntity | null> {
    const model = await this.repository.findOne({ 
      where: { id } as any 
    });
    return model ? this.mapper.toDomainEntity(model) : null;
  }

  async findAll(): Promise<DomainEntity[]> {
    const models = await this.repository.find();
    return models.map(model => this.mapper.toDomainEntity(model));
  }

  async update(entity: DomainEntity): Promise<DomainEntity> {
    const model = this.mapper.toDataBaseEntity(entity);
    const updatedModel = await this.repository.save(model);
    return this.mapper.toDomainEntity(updatedModel);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}