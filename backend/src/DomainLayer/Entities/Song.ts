import { v4 as uuidv4 } from "uuid";
import { BillboardList } from "./BillboardList";

export class Song{
    constructor(
        private readonly id: string,
        private nameSong: string,
        private albumId: string,
        private songDate: Date,
        private placeInBillbInt : number | null,
        private placeInBillNat : number | null
    ){}

    static create(nameSong : string, albumId : string, songDate : Date, placeInBillbInt: number, placeInBillNac : number): Song {
        
        if(!nameSong || nameSong.trim().length == 0)
            throw new Error("Song name can't be empty");

        if(!isNaN(songDate.getTime()))
            throw new Error("Song date should exists");
        
        //Aqui no hago validacion de place contra fecha porque eso debo hacerlo en otro punto de la aplicacion 
        return new Song(uuidv4(),nameSong, albumId, songDate, placeInBillbInt, placeInBillNac);
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

    public getPosNatBill() : number | null{
        return this.placeInBillNat;
    }

    public getPosIntBill() : number | null{
        return this.placeInBillbInt;
    }
}