import { ContractEntity} from '../Entities/ContractEntity';
import { IMapper } from "./IMapper";
import { Contract } from '@domain/Entities/Contract';
import { Agency} from '@domain/Entities/Agency';
import { Artist } from '@domain/Entities/Artist';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ContractMapper extends IMapper<Contract, ContractEntity> {
    
    toDomainEntity(dataBaseEntity: ContractEntity): Contract {
        // Método base - solo para la estructura simple
        return new Contract(
            this.generateDomainId(dataBaseEntity),
            dataBaseEntity.startDate,dataBaseEntity.endDate, null as any, null as any,
            parseFloat(dataBaseEntity.distributionPercentage.toString()),
            dataBaseEntity.status,
            dataBaseEntity.conditions
        );
    }

    // Método específico para reconstrucción completa
    toCompleteDomainEntity(
        dataBaseEntity: ContractEntity,
        agency: Agency, 
        artist: Artist
    ): Contract {
        return new Contract(
            this.generateDomainId(dataBaseEntity),
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
        entity.startDate = domainEntity.getStartDate();
        entity.endDate = domainEntity.getEndDate();
        entity.agencyID = domainEntity.getAgencyId().getId();
        entity.artistID = domainEntity.getArtistId().getId();
        entity.status = domainEntity.getStatus();
        entity.conditions = domainEntity.getConditions();
        entity.distributionPercentage = domainEntity.getDistributionPercentage();
        return entity;
    }

    private generateDomainId(dataBaseEntity: ContractEntity): string {
        return `${dataBaseEntity.agencyID}_${dataBaseEntity.artistID}`;
    }
}
