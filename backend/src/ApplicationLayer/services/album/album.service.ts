import { IAlbumRepository } from '@domain/Repositories/IAlbumRepository';
import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { Album } from '@domain/Entities/Album';
import { CreateAlbumDto } from '@application/DTOs/albumDto/create.album.dto';
import { ResponseAlbumDto } from '@application/DTOs/albumDto/response.album.dto';
import { UpdateAlbumDto } from '@application/DTOs/albumDto/update.album.dto';
import { AlbumDtoMapper } from '@application/DTOs/dtoMappers/album.dto.mapper';
import { ResponseSongBillboardDto } from '@application/DTOs/SongBillboardDto/response.songBillboard.dto';
import { SongBillboardDtoMapper } from '@application/DTOs/dtoMappers/song.billboard.dtoMapper';
import { ISongBillboardRepository } from '@domain/Repositories/ISonBillboardRepository';
import { SongDtoMapper } from '@application/DTOs/dtoMappers/song.dto.mapper';
import { ResponseSongDto } from '@application/DTOs/songDto/response.song.dto';
import { AssignAlbumToGroupUseCase } from '@application/UseCases/assign-album-to-group.use-case';
import { AssignAlbumToArtistUseCase } from '@application/UseCases/assign-album-to-artist.use-case';
import { AssignAlbumToGroupDto } from '@application/DTOs/albumDto/assign-album-to-group.dto';
import { AssignAlbumToArtistDto } from '@application/DTOs/albumDto/assign-album-to-artist.dto';

@Injectable()
export class AlbumService extends BaseService<Album,CreateAlbumDto,ResponseAlbumDto,UpdateAlbumDto>{
    constructor(
        @Inject(IAlbumRepository)
        private readonly albumRepository: IAlbumRepository,
        @Inject(ISongBillboardRepository)
        private readonly songBillboard : ISongBillboardRepository,
        private readonly albumDtoMapper: AlbumDtoMapper,
        private readonly assignAlbumToArtistUseCase: AssignAlbumToArtistUseCase,
        private readonly assignAlbumToGroupUseCase: AssignAlbumToGroupUseCase,
        private readonly songBillboardDtoMapper : SongBillboardDtoMapper,
        private readonly song : SongDtoMapper
    ) {
        super(albumRepository, albumDtoMapper)
    }

    async assignToArtist(dto: AssignAlbumToArtistDto): Promise<ResponseAlbumDto> {
        const album = await this.assignAlbumToArtistUseCase.execute(dto);
        return this.albumDtoMapper.toResponse(album);
    }

    async assignToGroup(dto: AssignAlbumToGroupDto): Promise<ResponseAlbumDto> {
        const album = await this.assignAlbumToGroupUseCase.execute(dto);
        return this.albumDtoMapper.toResponse(album);
    }

    async getAlbumsByArtist(artistId: string): Promise<ResponseAlbumDto[]> {
        const albums = await this.albumRepository.getAlbumsByArtist(artistId);
        return this.albumDtoMapper.toResponseList(albums);
    }

    async getAlbumsByGroup(groupId: string): Promise<ResponseAlbumDto[]> {
        const albums = await this.albumRepository.getAlbumsByGroup(groupId);
        return this.albumDtoMapper.toResponseList(albums);
    }
    
    async getAlbumHits(id: string): Promise<ResponseSongBillboardDto[]> {
        const songs = await this.albumRepository.getAllSong(id);
        const songsOnBillboard = await this.songBillboard.findAll();

        const songsFiltered = songsOnBillboard.filter(sb => 
            songs.some(s => s.getId() === sb.getSong().getId())
        );

        return this.songBillboardDtoMapper.toResponseList(songsFiltered);
    }

    async getAllSongs(id: string) : Promise<ResponseSongDto[]> {
        const songs = await this.albumRepository.getAllSong(id);
        return this.song.toResponseList(songs);
    }
}

