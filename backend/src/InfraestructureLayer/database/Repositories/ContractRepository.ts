import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { Contract } from '@domain/Entities/Contract';
import { IContractRepository } from '@domain/Repositories/IContractRepository';
import { ContractEntity } from '../Entities/ContractEntity';
import { ContractMapper } from '../Mappers/ContractMapper';
import { AgencyEntity } from '../Entities/AgencyEntity';
import { ArtistEntity } from '../Entities/ArtistEntity';

@Injectable()
export class ContractRepositoryImpl implements IContractRepository {

  constructor(
    @InjectRepository(ContractEntity)
    private readonly contractRepo: Repository<ContractEntity>,
    @InjectRepository(AgencyEntity)
    private readonly agencyRepo: Repository<AgencyEntity>,
    @InjectRepository(ArtistEntity)
    private readonly artistRepo: Repository<ArtistEntity>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly contractMapper: ContractMapper,
  ) {}
  async delete(id: string): Promise<void> {
    try {
      // El ID ahora es el contractID (no el ID compuesto)
      const result = await this.contractRepo.delete({
        contractID: id
      });
      
      if (result.affected === 0) {
        throw new Error(`Contract with ID ${id} not found`);
      }
    } catch (error) {
      console.error('Error deleting contract:', error);
      throw error;
    }
  }
  async findById(id: string): Promise<Contract | null> {
  // Primero obtener todas las columnas necesarias
  const entity = await this.contractRepo.findOne({
    where: { contractID: id },
    relations: this.getDefaultRelations(),
  });

  if (!entity) {
    return null;
  }

  // // Ahora buscar con TODAS las claves primarias
  // const fullEntity = await this.contractRepo.findOne({
  //   where: {
  //     contractID: entity.contractID,
  //     agencyID: entity.agencyID,
  //     artistID: entity.artistID,
  //     startDate: entity.startDate,
  //     endDate: entity.endDate
  //   },
  //   relations: this.getDefaultRelations(),
  // });

  return entity ? this.contractMapper.toCompleteDomainEntity(entity) : null;
}

  async findAll(): Promise<Contract[]> {
    const entities: ContractEntity[] = await this.contractRepo.find({
      relations: this.getDefaultRelations(),
    });    
    return entities.map(entity => this.contractMapper.toCompleteDomainEntity(entity));
  }

async update(entity: Contract): Promise<Contract> {
  return await this.dataSource.transaction(async (transactionalEntityManager: EntityManager) => {
    try {
      // 1. Primero buscar la entidad existente por la clave primaria compuesta
      const existingEntity = await transactionalEntityManager.findOne(ContractEntity, {
        where: {
          contractID: entity.getId(),
          agencyID: entity.getAgencyId().getId(),
          artistID: entity.getArtistId().getId(),
          startDate: entity.getStartDate(),
          endDate: entity.getEndDate()
        }
      });

      if (!existingEntity) {
        throw new Error(`Contract not found for update with ID: ${entity.getId()}`);
      }

      // 2. Actualizar los campos que pueden cambiar
      // (excluyendo la clave primaria)
      existingEntity.status = entity.getStatus();
      existingEntity.conditions = entity.getConditions();
      existingEntity.distributionPercentage = entity.getDistributionPercentage();
      
      // Si necesitas permitir cambiar fechas (peligroso porque son parte de PK)
      // existingEntity.startDate = entity.getStartDate();
      // existingEntity.endDate = entity.getEndDate();

      // 3. Guardar la actualización
      const updatedEntity = await transactionalEntityManager.save(
        ContractEntity, 
        existingEntity
      );

      // 4. Cargar con relaciones
      const fullContractEntity = await this.loadFullContract(
        transactionalEntityManager, 
        updatedEntity
      );

      return this.contractMapper.toCompleteDomainEntity(fullContractEntity);
    } catch (error) {
      console.error('Update transaction failed:', error);
      throw error;
    }
    });
  }
   async save(contract: Contract): Promise<Contract> {
    return await this.dataSource.transaction(async (transactionalEntityManager: EntityManager) => {
      try {
        // El ID del contrato ahora debe ser el contractID
        const contractId = contract.getId();
        
        // Verificar si ya existe un contrato con el mismo contractID
        const existingByContractId = await transactionalEntityManager.findOne(ContractEntity, {
          where: { contractID: contractId }
        });
        
        if (existingByContractId) {
          throw new Error(`A contract already exists with contractID: ${contractId}`);
        }

        // También verificar la unicidad por la combinación de agencyID, artistID, startDate, endDate
        const existingByComponents = await transactionalEntityManager.findOne(ContractEntity, {
          where: {
            agencyID: contract.getAgencyId().getId(),
            artistID: contract.getArtistId().getId(),
            startDate: contract.getStartDate(),
            endDate: contract.getEndDate()
          }
        });
        
        if (existingByComponents) {
          throw new Error('A contract already exists with these parameters (agency, artist, dates)');
        }

        // Convertir a entidad de base de datos
        const contractEntity: ContractEntity = this.contractMapper.toDataBaseEntity(contract);
        
        // Asegurar que el contractID esté establecido
        contractEntity.contractID = contractId;
        
        // Guardar el contrato principal
        const savedContractEntity: ContractEntity = await transactionalEntityManager.save(
          ContractEntity, 
          contractEntity
        );

        // Cargar el contrato completo con relaciones dentro de la transacción
        const fullContractEntity = await this.loadFullContract(
          transactionalEntityManager, 
          savedContractEntity
        );

        return this.contractMapper.toCompleteDomainEntity(fullContractEntity);
      } catch (error) {
        console.error('Transaction failed:', error);
        throw error;
      }
    });
  }

  private getDefaultRelations(): string[] {
    return ['agency', 'artist'];
  }

  private async loadFullContract(
    manager: EntityManager, 
    contractEntity: ContractEntity
  ): Promise<ContractEntity> {
    const entity = await manager.findOne(ContractEntity, {
      where: {
        agencyID: contractEntity.agencyID,
        artistID: contractEntity.artistID,
        startDate: contractEntity.startDate,
        endDate: contractEntity.endDate
      },
      relations: this.getDefaultRelations(),
    });

    if (!entity) {
      throw new Error(`Contract not found after save`);
    }

    return entity;
  }
}