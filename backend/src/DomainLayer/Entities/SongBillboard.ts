import { BillboardList } from "./BillboardList";
import { Song } from "./Song";

export class SongBillboard {
    constructor(
        private readonly song : Song,
        private readonly billboard : BillboardList,
        private readonly place : number,
        private readonly entryDate : Date
    ) {}

    public getSong() : Song{
        return this.song
    }

    public getBillboard() : BillboardList{
        return this.billboard;
    }

    public getPlace() : number{
        return this.place;
    }

    public getEntryDate() : Date{
        return this.entryDate;
    }

}