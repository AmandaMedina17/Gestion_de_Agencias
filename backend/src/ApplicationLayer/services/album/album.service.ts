import { BaseDtoMapper } from '@application/DTOs/dtoMappers/DtoMapper';
import { ALBUM_REPOSITORY, IAlbumRepository } from '@domain/Repositories/IAlbumRepository';
import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { Album } from '@domain/Entities/Album';

// @Injectable()
// export class AlbumService extends BaseService<Album,CreateAlbumDto,ResponseAlbumDto,UpdateAlbumDto>{
//     constructor(
//         @Inject(ALBUM_REPOSITORY)
//         private readonly songRepository: IAlbumRepository,
//         private readonly songDtoMapper: BaseDtoMapper<Album, CreateAlbumDto, ResponseAlbumDto>
//     ) {
//         super(songRepository, songDtoMapper)
//     }
// }

