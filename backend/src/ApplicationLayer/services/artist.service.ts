import { CreateArtistDto } from "@application/DTOs/artistDto/create-artist.dto";
import { ArtistResponseDto } from "@application/DTOs/artistDto/response-artist.dto";
import { UpdateArtistDto } from "@application/DTOs/artistDto/update-artist.dto";
import { Artist } from "@domain/Entities/Artist";
import { Injectable, Inject } from "@nestjs/common";
import { BaseService } from "./base.service";
import { IArtistRepository } from "@domain/Repositories/IArtistRepository";
// import { GetArtistContractsUseCase } from '../UseCases/get_artist_contracts.use-case';
import { ContractDtoMapper } from '../DTOs/dtoMappers/contract.dtoMapper';
import { ContractResponseDto } from "@application/DTOs/contractDto/response-contract.dto";
import { ArtistDtoMapper } from "@application/DTOs/dtoMappers/artist.dto";
import { GetArtistsWithAgencyChangesAndGroupsUseCase } from '../UseCases/get_artists_with_agency_changes_and_groups.use-case';

@Injectable()
export class ArtistService extends BaseService<Artist, CreateArtistDto, ArtistResponseDto, UpdateArtistDto>{
    constructor(
        @Inject(IArtistRepository)
        private readonly artistRepository: IArtistRepository,
        private readonly artistDtoMapper: ArtistDtoMapper,
        private readonly getArtistsWithAgencyChangesAndGroupsUseCase : GetArtistsWithAgencyChangesAndGroupsUseCase,
    ){
        super(artistRepository, artistDtoMapper)
    }
    async getArtistsWithAgencyChangesAndGroups() : Promise<ArtistResponseDto[]>{
        const artists = await this.getArtistsWithAgencyChangesAndGroupsUseCase.execute();
        return this.artistDtoMapper.toResponseList(artists);
    }
}