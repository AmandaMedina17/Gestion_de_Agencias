import { Apprentice } from "@domain/Entities/Apprentice";
import { BaseDtoMapper } from "./DtoMapper";
import { CreateApprenticeDto } from "../apprenticeDto/create-apprentice.dto";
import { ApprenticeResponseDto } from "../apprenticeDto/response-apprentice.dto";

export class ApprenticeDtoMapper extends BaseDtoMapper<Apprentice, CreateApprenticeDto, ApprenticeResponseDto>{
    fromDto(dto: CreateApprenticeDto): Apprentice {
        return Apprentice.create(dto.fullName, dto.age, dto.status, dto.trainingLevel, dto.entryDate, dto.agency);
    }
    toResponse(domain: Apprentice): ApprenticeResponseDto {
        return{
            id: domain.getId(),
            fullName:domain.getFullName(),
            age:domain.getAge(),
            status:domain.getStatus(),
            trainingLevel:domain.getTrainingLevel(),
            entryDate: domain.getJoinDate(),
            agency:domain.getAgency()
        }
    }
    
}