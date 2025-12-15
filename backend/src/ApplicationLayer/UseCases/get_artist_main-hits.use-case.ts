import { ArtistMainHitsDTO } from "@application/DTOs/artistMainHitsDto/ArtistMainHitsDTO";
import { ResponseAwardDto } from "@application/DTOs/AwardDto/response.award.dto";
import { ArtistDtoMapper } from "@application/DTOs/dtoMappers/artist.dtoMapper";
import { GroupDtoMapper } from "@application/DTOs/dtoMappers/group.dtoMapper";
import { ResponseSongBillboardDto } from "@application/DTOs/SongBillboardDto/response.songBillboard.dto";
import { AlbumService } from "@application/services/album/album.service";
import { IAlbumRepository } from "@domain/Repositories/IAlbumRepository";
import { IArtistRepository } from "@domain/Repositories/IArtistRepository";
import { IGroupRepository } from "@domain/Repositories/IGroupRepository";
import { ArtistRepository } from "@infrastructure/database/Repositories/ArtistRepository";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class GetArtistMainHitsUseCase {
    constructor(
        @Inject(IArtistRepository)
        private readonly artistRepository: IArtistRepository,
        @Inject(IAlbumRepository)
        private readonly albumRepository : IAlbumRepository,
        private readonly albumService : AlbumService,
        private readonly groupDtoMapper : GroupDtoMapper,
        private readonly artistDtoMapper : ArtistDtoMapper
    ) {}

    async execute(artistId: string): Promise<ArtistMainHitsDTO> {

        const artist = await this.artistRepository.findById(artistId);
        
        if(!artist)
            throw new NotFoundException(`Artist with id ${artistId} not found`);
    
        const soloAlbums = await this.albumRepository.getAlbumsByArtist(artistId);
        
        const soloSongsInBillboard: ResponseSongBillboardDto[] = [];
        const soloAwards: ResponseAwardDto[] = [];
    
        for (const album of soloAlbums) {
            const albumHits = await this.albumService.getAlbumHits(album.getId());
            soloSongsInBillboard.push(...albumHits);
            
            const albumAwards = await this.albumService.getAlbumAwards(album.getId());
            soloAwards.push(...albumAwards);
        }
    
            //Group hits section
            const lastGroup = await this.artistRepository.getArtistLastGroup(artistId);
            const groupAlbums = await this.albumRepository.getAlbumsByGroup(lastGroup.getId());
            
            const groupSongsInBillboard: ResponseSongBillboardDto[] = [];
            const groupAwards: ResponseAwardDto[] = [];
    
            for (const album of groupAlbums) {
                const albumHits = await this.albumService.getAlbumHits(album.getId());
                groupSongsInBillboard.push(...albumHits);
                
                const albumAwards = await this.albumService.getAlbumAwards(album.getId());
                groupAwards.push(...albumAwards);
            }
    
            const lastGroupMainHits = {
                group: this.groupDtoMapper.toResponse(lastGroup),
                songBillboard: groupSongsInBillboard,
                awards: groupAwards
            };
    
        return {
            artist: this.artistDtoMapper.toResponse(artist),
            aloneMainHits: {
                songBillboard: soloSongsInBillboard,
                awards: soloAwards
            },
            lastGroupMainHits
        };
    }
}
