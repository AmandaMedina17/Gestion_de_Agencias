import { ContractEntity} from '../Entities/ContractEntity';
import { IMapper } from "./IMapper";
import { Contract } from '@domain/Entities/Contract';
import { Agency} from '@domain/Entities/Agency';
import { Artist } from '@domain/Entities/Artist';
import { Injectable } from '@nestjs/common';
import { AgencyMapper } from './AgencyMapper';
import { ArtistMapper } from './ArtistMapper';

@Injectable()
export class ContractMapper extends IMapper<Contract, ContractEntity> {
    constructor(
        private readonly agencyMapper: AgencyMapper,
        private readonly artistMapper: ArtistMapper
    ) {
        super();
    }
    toDomainEntity(dataBaseEntity: ContractEntity): Contract {
        // Método base - solo para la estructura simple
        return new Contract(
            dataBaseEntity.contractID,
            dataBaseEntity.startDate,dataBaseEntity.endDate, null as any, null as any,
            parseFloat(dataBaseEntity.distributionPercentage.toString()),
            dataBaseEntity.status,
            dataBaseEntity.conditions
        );
    }

    // Método específico para reconstrucción completa
    toCompleteDomainEntity(
        dataBaseEntity: ContractEntity,
    ): Contract {
        // Verificar que las relaciones están cargadas
        if (!dataBaseEntity.agency) {
            throw new Error("La relación agency no está cargada en ContractEntity");
        }
        if (!dataBaseEntity.artist) {
            throw new Error("La relación artist no está cargada en ContractEntity");
        }
        const agency = this.agencyMapper.toDomainEntity(dataBaseEntity.agency);
        
        const artist = this.artistMapper.toDomainEntity(dataBaseEntity.artist);
        return new Contract(
            dataBaseEntity.contractID,
            dataBaseEntity.startDate, 
            dataBaseEntity.endDate,
            agency,
            artist,
            parseFloat(dataBaseEntity.distributionPercentage.toString()),
            dataBaseEntity.status,
            dataBaseEntity.conditions
        );
    }

    toDataBaseEntity(domainEntity: Contract): ContractEntity {
        const entity = new ContractEntity();
        entity.contractID = domainEntity.getId();
        entity.startDate = domainEntity.getStartDate();
        entity.endDate = domainEntity.getEndDate();
        entity.agencyID = domainEntity.getAgencyId().getId();
        entity.artistID = domainEntity.getArtistId().getId();
        entity.status = domainEntity.getStatus();
        entity.conditions = domainEntity.getConditions();
        entity.distributionPercentage = domainEntity.getDistributionPercentage();
        return entity;
    }
}