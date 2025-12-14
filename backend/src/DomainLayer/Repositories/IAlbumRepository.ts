import { Album } from "@domain/Entities/Album";
import { IRepository } from "./IRepository";
import { SongBillboard } from "@domain/Entities/SongBillboard";
import { Song } from "@domain/Entities/Song";

export abstract class IAlbumRepository extends IRepository<Album>{
    abstract findByTitle(title : string ) : Promise<Album>
    abstract getAllSong(id: string) : Promise<Song[]>
}
