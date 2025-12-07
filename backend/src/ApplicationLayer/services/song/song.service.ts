import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { Song } from '@domain/Entities/Song';
import { CreateSongDto } from '@application/DTOs/songDto/create.song.dto';
import { ResponseSongDto } from '@application/DTOs/songDto/response.song.dto';
import { UpdateSongDto } from '@application/DTOs/songDto/update.song.dto';
import { ISongRepository } from '@domain/Repositories/ISongRepository';
import { CreateSongUseCase } from '@application/UseCases/create_song.use-case';
import { UpdateSongUseCase } from '@application/UseCases/update_song.use-case';
import { SongDtoMapper } from '@application/DTOs/dtoMappers/song.dto.mapper';

@Injectable()
export class SongService extends BaseService<Song,CreateSongDto,ResponseSongDto,UpdateSongDto>{
    constructor(
        @Inject(ISongRepository)
        private readonly songRepository: ISongRepository,
        private readonly songDtoMapper: SongDtoMapper,
        private readonly create_song_use_case: CreateSongUseCase,
        private readonly update_song_use_case : UpdateSongUseCase
    ) {
        super(songRepository, songDtoMapper)
    }

    async create(createSongDto: CreateSongDto): Promise<ResponseSongDto> {
        const savedEntity = await this.create_song_use_case.execute(createSongDto)
        return this.mapper.toResponse(savedEntity)
      }
      async update(id: string ,updateSongDto: UpdateSongDto): Promise<ResponseSongDto> {
        console.log("El update creado se llama")
        console.log(this.update_song_use_case.execute)
        const savedEntity = await this.update_song_use_case.execute(id,updateSongDto)
        return this.mapper.toResponse(savedEntity)
      }


}
