import { Injectable, Inject } from '@nestjs/common';
import { IArtistRepository } from '@domain/Repositories/IArtistRepository';
import { Artist } from '@domain/Entities/Artist';
import { IGroupRepository } from '@domain/Repositories/IGroupRepository';

@Injectable()
export class GetArtistsWithDebutUseCase {
  constructor(
    @Inject(IArtistRepository)
    private readonly artistRepository: IArtistRepository,
   ) {}

  async execute(agencyId?: string): Promise<Artist[]> {
    return await this.artistRepository.getArtistsWithDebut(agencyId);
 }
}