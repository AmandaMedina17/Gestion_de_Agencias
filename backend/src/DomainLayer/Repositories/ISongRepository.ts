import { Song } from "@domain/Entities/Song";
import { IRepository } from "./IRepository";
import { BillboardListScope } from "@domain/Enums";

export abstract class ISongRepository extends IRepository<Song>{
    abstract findbyPandY(position : number, date : Date, type : BillboardListScope) : Promise<Song>; //inutil
    abstract updateAlbum(id: string, newAlbumId : string) : Promise<void>;
    abstract updateName(id : string, data : Partial<Song>) : Promise<Song | null>; 
}
