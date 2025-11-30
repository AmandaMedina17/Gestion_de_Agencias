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
        throw new Error("Method not implemented.");
    }

    static create(nameSong : string, albumId : string, songDate :Date): Song {
        
        if(!nameSong || nameSong.trim().length == 0)
            throw new Error("Song name can't be empty");

        if(!isNaN(songDate.getTime()))
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