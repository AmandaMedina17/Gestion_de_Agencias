import { ContractEntity} from '../Entities/ContractEntity';
import { IMapper } from "./IMapper";
import { Contract } from '@domain/Entities/Contract';
import { Agency} from '@domain/Entities/Agency';
import { Artist } from '@domain/Entities/Artist';
import { Interval } from '@domain/Entities/Interval';

export class ContractMapper extends IMapper<Contract, ContractEntity> {
    
    toDomainEntity(dataBaseEntity: ContractEntity): Contract {
        // Método base - solo para la estructura simple
        return new Contract(
            this.generateDomainId(dataBaseEntity),
            null as any, null as any, null as any,
            parseFloat(dataBaseEntity.distributionPercentage.toString()),
            dataBaseEntity.status,
            dataBaseEntity.conditions
        );
    }

    // Método específico para reconstrucción completa
    toCompleteDomainEntity(
        dataBaseEntity: ContractEntity,
        interval: Interval,
        agency: Agency, 
        artist: Artist
    ): Contract {
        return new Contract(
            this.generateDomainId(dataBaseEntity),
            interval,
            agency,
            artist,
            parseFloat(dataBaseEntity.distributionPercentage.toString()),
            dataBaseEntity.status,
            dataBaseEntity.conditions
        );
    }

    toDataBaseEntity(domainEntity: Contract): ContractEntity {
        const entity = new ContractEntity();
        entity.intervalID = domainEntity.getInterval().getId();
        entity.agencyID = domainEntity.getAgencyId().getId();
        entity.artistID = domainEntity.getArtistId().getId();
        entity.status = domainEntity.getStatus();
        entity.conditions = domainEntity.getConditions();
        entity.distributionPercentage = domainEntity.getDistributionPercentage();
        return entity;
    }

    private generateDomainId(dataBaseEntity: ContractEntity): string {
        return `${dataBaseEntity.intervalID}_${dataBaseEntity.agencyID}_${dataBaseEntity.artistID}`;
    }
}
