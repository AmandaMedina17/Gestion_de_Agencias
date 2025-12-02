import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { Song } from '@domain/Entities/Song';
import { CreateSongDto } from '@application/DTOs/songDto/create.song.dto';
import { ResponseSongDto } from '@application/DTOs/songDto/response.song.dto';
import { UpdateSongDto } from '@application/DTOs/songDto/update.song.dto';
import { ISongRepository, SONG_REPOSITORY } from '@domain/Repositories/ISongRepository';
import { SongDtoMapper } from '@application/DTOs/dtoMappers/song.dto.mapper';

@Injectable()
export class SongService extends BaseService<Song,CreateSongDto,ResponseSongDto,UpdateSongDto>{
    constructor(
        @Inject(SONG_REPOSITORY)
        private readonly songRepository: ISongRepository,
        private readonly songDtoMapper: SongDtoMapper
    ) {
        super(songRepository, songDtoMapper)
    }
}
