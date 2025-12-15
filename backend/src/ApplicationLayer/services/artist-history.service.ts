import { ResponseArtistHistoryDto } from '@application/DTOs/artist_historyDto/response.artistHistory.dto';
import { AlbumDtoMapper } from '@application/DTOs/dtoMappers/album.dto.mapper';
import { ArtistDtoMapper } from '@application/DTOs/dtoMappers/artist.dtoMapper';
import { ContractDtoMapper } from '@application/DTOs/dtoMappers/contract.dtoMapper';
import { GroupDtoMapper } from '@application/DTOs/dtoMappers/group.dtoMapper';
import { IAlbumRepository } from '@domain/Repositories/IAlbumRepository';
import { IArtistHistoryRepository } from '@domain/Repositories/IArtistHistoryRepository';
import { IArtistRepository } from '@domain/Repositories/IArtistRepository';
import { IContractRepository } from '@domain/Repositories/IContractRepository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ArtistsHistoryService {
    constructor(
        @Inject(IArtistHistoryRepository)
        private readonly artistHistoryRepository : IArtistHistoryRepository ,
        @Inject(IArtistRepository)
        private readonly artistRepository: IArtistRepository,
        @Inject(IContractRepository)
        private readonly contractRepository: IContractRepository,
        @Inject(IAlbumRepository)
        private readonly albumRepository: IAlbumRepository,
        private readonly artistDtoMapper: ArtistDtoMapper,
        private readonly contractDtoMapper : ContractDtoMapper,
        private readonly albumDtoMapper :AlbumDtoMapper,
        private readonly groupDtoMapper : GroupDtoMapper

    ){}

    async getArtistsHistory(): Promise<ResponseArtistHistoryDto[]> {
       const artistIds = await this.artistHistoryRepository.getQualifiedArtistsIds();
        
       const historyPromises = artistIds.map(async (id) => {
        const [artist, contracts, groups, albums] = await Promise.all([
            this.artistRepository.findById(id),
            this.contractRepository.getArtistContracts(id),
            this.artistRepository.getArtistGroups(id),
            this.albumRepository.getAlbumsByArtist(id)
        ]);
         
        const dto = new ResponseArtistHistoryDto();
        dto.artist = this.artistDtoMapper.toResponse(artist!);
        dto.groups = this.groupDtoMapper.toResponseList(groups)
        dto.contracts = this.contractDtoMapper.toResponseList(contracts);
        dto.albums = this.albumDtoMapper.toResponseList(albums);

        return dto;
     });

     return Promise.all(historyPromises);
    }
}