import { Injectable, Inject } from '@nestjs/common';
import { BaseDtoMapper } from '@application/DTOs/dtoMappers/DtoMapper';
import { IRepository } from '@domain/Repositories/IRepository';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class BaseService<DomainEntity extends IUpdatable<UpdateDto>, CreateDto, ResponseDto, UpdateDto> {

  constructor(
     @Inject(IRepository)
     protected readonly repository: IRepository<DomainEntity>,
     protected readonly mapper: BaseDtoMapper<DomainEntity, CreateDto, ResponseDto>
   ) {}

  async create(createDto: CreateDto) : Promise<ResponseDto> {
    const domainEntity = this.mapper.fromDto(createDto)
    const savedEntity = await this.repository.save(domainEntity)
    return this.mapper.toResponse(savedEntity)
  }

  async findAll() : Promise<ResponseDto[]> {
    const domainEntities = await this.repository.findAll()
    return this.mapper.toResponseList(domainEntities)
  }

  async findOne(id: string): Promise<ResponseDto> {
    const domainEntity = await this.repository.findById(id);
    if (!domainEntity) {
        throw new NotFoundException(`Entity with ID ${id} not found`);
    }
    return this.mapper.toResponse(domainEntity);
  }

  async update(id: string, updateDto: UpdateDto) {
      const domainEntity = await this.repository.findById(id);

      if (!domainEntity) {
        throw new NotFoundException(`Entity with ID ${id} not found`);
      }

      domainEntity.update(updateDto);

      await this.repository.update(domainEntity);

      const updatedEntity = await this.repository.findById(id);
       if (!updatedEntity) {
          throw new NotFoundException(`Entity with ID ${id} not found after update`);
        }
    
    return this.mapper.toResponse(updatedEntity);
  }

  remove(id: string): Promise<void> {
    return this.repository.delete(id)
  }
}