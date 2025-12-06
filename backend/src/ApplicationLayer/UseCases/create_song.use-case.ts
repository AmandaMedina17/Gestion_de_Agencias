
import { CreateSongDto } from "@application/DTOs/songDto/create.song.dto";
import { Song } from "@domain/Entities/Song";
import { IAlbumRepository } from "@domain/Repositories/IAlbumRepository";
import { ISongRepository } from "@domain/Repositories/ISongRepository";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class CreateSongUseCase {
  constructor(
    @Inject(ISongRepository)
    private readonly songRepository: ISongRepository,
    @Inject(IAlbumRepository)
    private readonly albumRepository: IAlbumRepository
  ) {}

  async execute(songDto: CreateSongDto): Promise<Song> {

    const album = await this.albumRepository.findById(songDto.idAlbum);
    if (!album)
      throw new Error(`album with id ${songDto.idAlbum} not found`);

    const song = Song.create(
        songDto.nameSong,
        songDto.idAlbum,
        album.getReleaseDate()
    )
    
    return await this.songRepository.save(song);
  }
}