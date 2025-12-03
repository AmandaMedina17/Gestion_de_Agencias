import { IUpdatable } from "@domain/UpdatableInterface";
import { UpdateData } from "@domain/UpdateData";
import { DateValue } from "@domain/Value Objects/Values";
import { v4 as uuidv4 } from "uuid";

export class Song implements IUpdatable{
    constructor(
        private readonly id: string,
        private nameSong: string,
        private albumId: string,
        private songDate: Date,
    ){}
    update(updateDto: UpdateData): void {
        
        updateDto.nameSong = updateDto.nameSong != undefined ? updateDto.nameSong : this.nameSong
        updateDto.albumId = updateDto.albumId != undefined ? updateDto.albumId : this.albumId
        updateDto.releaseDate = updateDto.releaseDate != undefined ? updateDto.releaseDate : this.songDate
        
        const albumUpadte = Song.create(updateDto.nameSong,updateDto.albumId,updateDto.releaseDate)
                
        this.nameSong = albumUpadte.nameSong 
        this.albumId = albumUpadte.albumId 
        this.songDate = albumUpadte.songDate   
    }

    static create(nameSong : string, albumId : string, songDate :Date): Song {
        
        if(!nameSong || nameSong.trim().length == 0)
            throw new Error("Song name can't be empty");

        if(!songDate)
            throw new Error("Song date should exists");
        
        return new Song(uuidv4(),nameSong, albumId, songDate);
    }

    public getId(): string{
        return this.id;
    }

    public getName(): string{
        return this.nameSong;
    }

    public getAlbumId(): string{
        return this.albumId;
    }

    public getDate() : Date{
        return this.songDate;
    }
}