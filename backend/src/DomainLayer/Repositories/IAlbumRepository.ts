import { Album } from "@domain/Entities/Album";
import { IRepository } from "./IRepository";
import { AlbumEntity } from "@infrastructure/database/Entities/AlbumEntity";

export abstract class IAlbumRepository extends IRepository<Album>{
    abstract findByTitle(title : string ) : Promise<Album>
}
