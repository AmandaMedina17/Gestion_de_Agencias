import { Injectable, Inject } from '@nestjs/common';
import { IArtistRepository } from '@domain/Repositories/IArtistRepository';
import { Artist } from '@domain/Entities/Artist';
import { ArtistResponseDto } from '@application/DTOs/artistDto/response-artist.dto';
import { ArtistDtoMapper } from '@application/DTOs/dtoMappers/artist.dtoMapper';

@Injectable()
export class GetArtistsWithAgencyChangesAndGroupsUseCase {
  constructor(
    @Inject(IArtistRepository)
    private readonly artistRepository: IArtistRepository,
    private readonly artistDtoMapper: ArtistDtoMapper
  ) {}

  async execute(): Promise<Artist[]> {
    return await this.artistRepository.getArtists_WithAgencyChangesAndGroups();
  }
}