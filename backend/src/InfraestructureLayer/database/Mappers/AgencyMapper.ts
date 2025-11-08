import { Agency } from "@domain/Entities/Agency";
import { AgencyEntity } from "../Entities/AgencyEntity";
import { DateValue } from "@domain/Value Objects/Values";
import { IMapper } from "./IMapper";

export class AgencyMapper implements IMapper<Agency, AgencyEntity> {
  toDomainEntities(entities: AgencyEntity[]): Agency[] {
    return entities.map(entity => this.toDomainEntity(entity));
  }
  toDataBaseEntities(domains: Agency[]): AgencyEntity[] {
    return domains.map(domain => this.toDataBaseEntity(domain));
  }
  
  toDomainEntity(dataBaseEntity: AgencyEntity): Agency {
    try {
      const place = dataBaseEntity.place;
      // Reconstruir el Value Object DateValue desde la fecha almacenada
      const dateFundation = DateValue.fromString(
        dataBaseEntity.dateFundation.toISOString().split('T')[0] // Formato YYYY-MM-DD
      );

      // Reconstruir la entidad de dominio
      return new Agency(
        dataBaseEntity.id,
        place,
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
    agencyEntity.apprentices = [];
    agencyEntity.groups = [];
    agencyEntity.artistMemberships = [];

    return agencyEntity;
  }
}