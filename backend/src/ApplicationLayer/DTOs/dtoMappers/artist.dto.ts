import { Artist } from "@domain/Entities/Artist";
import { BaseDtoMapper } from "./DtoMapper";
import { CreateApprenticeDto } from "../apprenticeDto/create-apprentice.dto";
import { CreateArtistDto } from "../artistDto/create-artist.dto";
import { ArtistResponseDto } from "../artistDto/response-artist.dto";

export class ArtistDtoMapper extends BaseDtoMapper<Artist, CreateArtistDto, ArtistResponseDto>{
    fromDto(dto: CreateArtistDto): Artist {
        return Artist.create(dto.transitionDate, dto.status, dto.stageName, dto.birthday, dto.groupId, dto.apprenticeId);
    }
    toResponse(domain: Artist): ArtistResponseDto {
        return{
            id: domain.getId(),
            transitionDate: domain.getDebutDate(),
            status: domain.getStatusArtist(),
            stageName: domain.getStageName(),
            birthday: domain.getBirthDate(),
            groupId: domain.getGroup(),
            apprenticeId: domain.getApprenticeId()
        }
    }
    
}