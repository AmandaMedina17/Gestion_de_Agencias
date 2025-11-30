import { Agency } from "@domain/Entities/Agency";
import { AgencyEntity } from "../Entities/AgencyEntity";
import { IMapper } from "./IMapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AgencyMapper extends IMapper<Agency, AgencyEntity> {
  
  toDomainEntity(dataBaseEntity: AgencyEntity): Agency {
    try {
      // Reconstruir la entidad de dominio
      return new Agency(
        dataBaseEntity.id,
        dataBaseEntity.place,
        dataBaseEntity.name,
        dataBaseEntity.dateFundation
      );
    } catch (error) {
      throw new Error(`Error mapping database entity to domain: ${error}`);
    }
  }

  toDataBaseEntity(domainEntity: Agency): AgencyEntity {
    const agencyEntity = new AgencyEntity();
    
    // Mapear propiedades simples
    agencyEntity.id = domainEntity.getId();
    agencyEntity.name = domainEntity.getName();
    agencyEntity.place = domainEntity.getPlace();
    agencyEntity.dateFundation = domainEntity.getDateFundation();
    
    // Las relaciones se manejan en el repositorio
    agencyEntity.groups = [];
    agencyEntity.artistMemberships = [];

    return agencyEntity;
  }
}