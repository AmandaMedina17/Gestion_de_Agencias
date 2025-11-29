import { Contract } from "@domain/Entities/Contract";
import { BaseDtoMapper } from "./DtoMapper";
import { CreateContractDto } from "../contractDto/create-contract.dto";
import { ContractResponseDto } from "../contractDto/response-contract.dto";
import { AgencyDtoMapper } from "./agency.dtoMapper";
import { ArtistDtoMapper } from "./artist.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ContractDtoMapper extends BaseDtoMapper<Contract, CreateContractDto,ContractResponseDto>{
    constructor(
       private readonly artistDtoMapper: ArtistDtoMapper,
       private readonly agencyDtoMapper: AgencyDtoMapper
    ){
    super()
    }
    fromDto(dto: CreateContractDto): Contract {
        throw new Error('Contract creation requires complex logic. Use CreateContractUseCase instead.');
    }
    toResponse(domain: Contract): ContractResponseDto {
        if (!domain) {
            throw new Error('Contract is undefined in ContractDtoMapper');
        }
        // Validar que los mappers estén disponibles
        if (!this.agencyDtoMapper) {
            throw new Error('AgencyDtoMapper is not injected');
        }

        if (!this.artistDtoMapper) {
            throw new Error('ArtistDtoMapper is not injected');
        }
        return {
            id: domain.getId(),
            startDate: domain.getStartDate(),
            endDate: domain.getEndDate(),
            agency: this.agencyDtoMapper.toResponse(domain.getAgencyId()),
            artist: this.artistDtoMapper.toResponse(domain.getArtistId()),
            distributionPercentage: domain.getDistributionPercentage(),
            status: domain.getStatus(),
            conditions: domain.getConditions()
        };
    }
}