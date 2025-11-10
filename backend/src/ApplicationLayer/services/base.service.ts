import { Injectable, Inject } from '@nestjs/common';
import { BaseDtoMapper } from '@application/DTOs/DtoMappers/DtoMapper';
import { IRepository } from '@domain/Repositories/IRepository';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class BaseService<DomainEntity, CreateDto, ResponseDto> {

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

//   update(id: number, updateResponsibleDto: UpdateResponsibleDto) {
//     return `This action updates a #${id} responsible`;
//   }

  remove(id: string): Promise<void> {
    return this.repository.delete(id)
  }
}