import { Agency } from "@domain/Entities/Agency";
import { AgencyEntity } from "../Entities/AgencyEntity";
import { Place, DateValue } from "@domain/Value Objects/Values";
import { IMapper } from "./IMapper";

export class AgencyMapper implements IMapper<Agency, AgencyEntity> {
  
  toDomainEntity(dataBaseEntity: AgencyEntity): Agency {
    try {
      // Reconstruir el Value Object Place desde el string almacenado
      const placeData = JSON.parse(dataBaseEntity.place);
      const place = new Place(
        placeData.country,
        placeData.state, 
        placeData.namePlace
      );

      // Reconstruir el Value Object DateValue desde la fecha almacenada
      const dateFundation = DateValue.fromString(
        dataBaseEntity.dateFundation.toISOString().split('T')[0] // Formato YYYY-MM-DD
      );

      // Reconstruir la entidad de dominio
      return new Agency(
        dataBaseEntity.id,
        place,
        dataBaseEntity.name,
        dateFundation
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
    
    // Serializar el Value Object Place a JSON string
    const place = domainEntity.getPlace();
    agencyEntity.place = JSON.stringify({
      country: place['country'], // Accediendo a la propiedad privada
      state: place['state'],
      namePlace: place['namePlace']
    });

    // Convertir DateValue a Date
    const dateFundation = domainEntity.getDateFundation();
    agencyEntity.dateFundation = dateFundation.getValue();

    // Las relaciones se manejan en el repositorio
    agencyEntity.apprentices = [];
    agencyEntity.groups = [];
    agencyEntity.artistMemberships = [];

    return agencyEntity;
  }
}