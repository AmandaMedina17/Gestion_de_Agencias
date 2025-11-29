import { Agency } from "@domain/Entities/Agency";
import { BaseDtoMapper } from "./DtoMapper";
import { CreateAgencyDto } from "../agencyDto/create-agency.dto";
import { AgencyResponseDto } from "../agencyDto/response-agency.dto";

export class AgencyDtoMapper extends BaseDtoMapper<Agency, CreateAgencyDto, AgencyResponseDto>{
    fromDto(dto: CreateAgencyDto): Agency {
        return Agency.create(dto.place, dto.nameAgency, dto.dateFundation);
    }
    toResponse(domain: Agency): AgencyResponseDto {
        return{
            id: domain.getId(),
            place: domain.getPlace(),
            nameAgency: domain.getName(),
            dateFundation: domain.getDateFundation()
        }
    }
    
}