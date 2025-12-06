import { UpdateSongDto } from "@application/DTOs/songDto/update.song.dto";
import { Album } from "@domain/Entities/Album";
import { Song } from "@domain/Entities/Song";
import { IAlbumRepository } from "@domain/Repositories/IAlbumRepository";
import { ISongRepository } from "@domain/Repositories/ISongRepository";
import { AlbumEntity } from "@infrastructure/database/Entities/AlbumEntity";
import { AlbumRepository } from "@infrastructure/database/Repositories/AlbumRepository";
import { Inject, Injectable } from "@nestjs/common";
import { Console } from "console";
import { console } from "inspector";

@Injectable()
export class UpdateSongUseCase {
    constructor(
        //@Inject(IAlbumRepository)
        private readonly albumRepository : IAlbumRepository,
        //@Inject(ISongRepository)
        private readonly songRepository : ISongRepository
    ) {}

    async execute(id :string, song :UpdateSongDto) :Promise<Song>{
        const entity : Song | null = await this.songRepository.findById(id);
        
        if(!entity)
            throw new Error("The song you wana update doesn't exist");

        const album = await this.albumRepository.findById(song.idAlbum!);

        if(!album)
            throw new Error("The album you wanna put to the song doesn't exist");

        if(entity.getAlbumId() != album!.getId()){
            //await this.songRepository.updateAlbum(id, song.idAlbum!);
            entity.setAlbumId(song.idAlbum!)

        }

        entity.setName(song.nameSong)

        return await this.songRepository.update(entity);
    }
}