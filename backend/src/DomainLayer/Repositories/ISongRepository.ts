import { Song } from "@domain/Entities/Song";
import { IRepository } from "./IRepository";
import { BillboardListScope } from "@domain/Enums";

export abstract class ISongRepository extends IRepository<Song>{
    abstract findbyPandY(position : number, date : Date, type : BillboardListScope) : Promise<Song>; //this query will find the song by its position on billboard and year 
    //Here we can also add find a list of songs from an artist. Some things like that 
    
}
