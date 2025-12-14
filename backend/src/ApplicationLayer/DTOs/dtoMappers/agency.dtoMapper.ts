import { Agency } from "@domain/Entities/Agency";
import { BaseDtoMapper } from "./DtoMapper";
import { CreateAgencyDto } from "../agencyDto/create-agency.dto";
import { AgencyResponseDto } from "../agencyDto/response-agency.dto";
import { PlaceDtoMapper } from "./place.dtoMapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AgencyDtoMapper extends BaseDtoMapper<Agency, CreateAgencyDto, AgencyResponseDto>{

    constructor(
           private readonly placeDtoMapper: PlaceDtoMapper
    ){
        super()
    }

    fromDto(dto: CreateAgencyDto): Agency {
        throw new Error('Agency creation requires complex logic. Use CreateAgencyUseCase instead.');
    }

    toResponse(domain: Agency): AgencyResponseDto {
        return{
            id: domain.getId(),
            place: this.placeDtoMapper.toResponse(domain.getPlace()),
            nameAgency: domain.getName(),
            dateFundation: domain.getDateFundation()
        }
    }
    
}