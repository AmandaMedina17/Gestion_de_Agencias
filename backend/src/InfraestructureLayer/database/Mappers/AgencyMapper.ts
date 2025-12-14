import { Agency } from "@domain/Entities/Agency";
import { AgencyEntity } from "../Entities/AgencyEntity";
import { IMapper } from "./IMapper";
import { Injectable } from "@nestjs/common";
import { PlaceMapper } from "./PlaceMapper";

@Injectable()
export class AgencyMapper extends IMapper<Agency, AgencyEntity> {

  constructor(
    private readonly placeMapper: PlaceMapper
  ){
  super()
  }
  
  toDomainEntity(dataBaseEntity: AgencyEntity): Agency {
    try {
      // Reconstruir la entidad de dominio
      return new Agency(
        dataBaseEntity.id,
        this.placeMapper.toDomainEntity(dataBaseEntity.place),
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
    agencyEntity.place = this.placeMapper.toDataBaseEntity(domainEntity.getPlace())
    agencyEntity.dateFundation = domainEntity.getDateFundation();
    
    // Las relaciones se manejan en el repositorio
    agencyEntity.groups = [];
    agencyEntity.artistMemberships = [];

    return agencyEntity;
  }
}