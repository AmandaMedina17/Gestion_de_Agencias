import { Album } from "@domain/Entities/Album";
import { IRepository } from "./IRepository";
import { AlbumEntity } from "@infrastructure/database/Entities/AlbumEntity";
import { Song } from "@domain/Entities/Song";

export abstract class IAlbumRepository extends IRepository<Album>{
    abstract findByTitle(title : string ) : Promise<Album>
    abstract getHits(id : string) : Promise<[Song,number][]>

    
}
