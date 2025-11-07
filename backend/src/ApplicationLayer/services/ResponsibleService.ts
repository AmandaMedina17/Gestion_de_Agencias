import { Injectable, Inject } from '@nestjs/common';
import { IResponsibleRepository } from '@domain/Repositories/IResponsibleRepository';
import { Responsible } from '@domain/Entities/Responsible';
import { CreateResponsibleDto } from '@application/DTOs/ResponsibleDto/create-responsible.dto';
//import { UpdateResponsibleDto } from '@application/DTOs/ResponsibleDto/update-responsible.dto';

@Injectable()
export class ResponsibleService {
  constructor(
    @Inject(IResponsibleRepository)
    private readonly responsibleRepository: IResponsibleRepository,
  ) {}

  // ✅ CREATE: DTO → Entity → Repository → Response DTO
  async create(createDto: CreateResponsibleDto): Promise<CreateResponsibleDto> {
    const entity = this.createDtoToEntity(createDto);
    const savedEntity = await this.responsibleRepository.save(entity);
    return this.entityToResponseDto(savedEntity);
  }

  // ✅ FIND ALL: Repository → Entities → Response DTOs
  async findAll(): Promise<CreateResponsibleDto[]> {
    const entities = await this.responsibleRepository.findAll();
    return entities.map(entity => this.entityToResponseDto(entity));
  }

  // ✅ FIND BY ID: Repository → Entity → Response DTO
  async findById(id: string): Promise<CreateResponsibleDto | null> {
    const entity = await this.responsibleRepository.findById(id);
    return entity ? this.entityToResponseDto(entity) : null;
  }

  async delete(id: string): Promise<void> {
    await this.responsibleRepository.delete(id);
  }

  // // ✅ UPDATE: DTO + Existing Entity → Updated Entity → Repository → Response DTO
  // async update(id: string, updateDto: UpdateResponsibleDto): Promise<CreateResponsibleDto> {
  //   const existingEntity = await this.responsibleRepository.findById(id);
  //   if (!existingEntity) {
  //     throw new Error('Responsible not found');
  //   }

  //   const updatedEntity = this.updateDtoToEntity(updateDto, existingEntity);
  //   const savedEntity = await this.responsibleRepository.update(updatedEntity);
  //   return this.entityToResponseDto(savedEntity);
  // }

  // ✅ DELETE: Operación simple

  // ✅ TRANSFORMADORES: La esencia del servicio

  private createDtoToEntity(dto: CreateResponsibleDto): Responsible {
    return Responsible.create(dto.name);
  }

  private entityToResponseDto(entity: Responsible): CreateResponsibleDto {
    return new CreateResponsibleDto(
      entity.getName()
    );
  }

  // private updateDtoToEntity(dto: UpdateResponsibleDto, existing: Responsible): Responsible {
  //   return new Responsible(
  //     dto.name ?? existing.name,
  //     dto.email ?? existing.email,
  //     dto.phone ?? existing.phone,
  //     dto.department ?? existing.department
  //   );
  // }

}