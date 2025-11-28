import { CreateArtistDto } from "@application/DTOs/artistDto/create-artist.dto";
import { ArtistResponseDto } from "@application/DTOs/artistDto/response-artist.dto";
import { UpdateArtistDto } from "@application/DTOs/artistDto/update-artist.dto";
import { Artist } from "@domain/Entities/Artist";
import { Injectable, Inject } from "@nestjs/common";
import { BaseService } from "./base.service";
import { IArtistRepository } from "@domain/Repositories/IArtistRepository";
import { BaseDtoMapper } from "@application/DTOs/dtoMappers/DtoMapper";
import { ApprenticeRepository } from "@infrastructure/database/Repositories/ApprenticeRepository";

@Injectable()
export class ArtistService extends BaseService<Artist, CreateArtistDto, ArtistResponseDto, UpdateArtistDto>{
    constructor(
        @Inject(IArtistRepository)
        private readonly artistRepository: IArtistRepository,
        private readonly artistDtoMapper: BaseDtoMapper<Artist, CreateArtistDto, ArtistResponseDto>
    ){
        super(artistRepository, artistDtoMapper)
    }

    
}