import { Song } from "@domain/Entities/Song";

export interface ISongRepository{
    findbyPandY(position : number, date : Date) : Promise<Song>; //this query will find the song by its position on billboard and year 
    //Here we can also add find a list of songs from an artist. Some things like that 
    
}

export const SONG_REPOSITORY = Symbol('ISongRepository');