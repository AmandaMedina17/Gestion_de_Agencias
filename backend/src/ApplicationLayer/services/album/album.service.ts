import { BaseDtoMapper } from '@application/DTOs/dtoMappers/DtoMapper';
import { ALBUM_REPOSITORY, IAlbumRepository } from '@domain/Repositories/IAlbumRepository';
import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { Album } from '@domain/Entities/Album';
import { CreateAlbumDto } from '@application/DTOs/albumDto/create.album.dto';
import { ResponseAlbumDto } from '@application/DTOs/albumDto/response.album.dto';
import { UpdateAlbumDto } from '@application/DTOs/albumDto/update.album.dto';

@Injectable()
export class AlbumService extends BaseService<Album,CreateAlbumDto,ResponseAlbumDto,UpdateAlbumDto>{
    constructor(
        @Inject(ALBUM_REPOSITORY)
        private readonly albumRepository: IAlbumRepository,
        private readonly albumDtoMapper: BaseDtoMapper<Album, CreateAlbumDto, ResponseAlbumDto>
    ) {
        super(albumRepository, albumDtoMapper)
    }
}

