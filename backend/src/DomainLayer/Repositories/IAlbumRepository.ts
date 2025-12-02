import { Album } from "@domain/Entities/Album";
import { IRepository } from "./IRepository";
import { AlbumEntity } from "@infrastructure/database/Entities/AlbumEntity";

export interface IAlbumRepository extends IRepository<Album>{
    findByTitle(title : string ) : Promise<Album>
}

export const ALBUM_REPOSITORY = Symbol('IAlbumRepository');  