import { v4 as uuidv4 } from "uuid";
import { BillboardList } from "./BillboardList";

export class Song{
    constructor(
        private readonly id: string,
        private nameSong: string,
        private albumId: string
    )
    {

    }

    public create(nameSong : string, albumId : string): Song {
        const id  = uuidv4()
        return new Song(id, nameSong, albumId);
    }
    public getName(): string{
        return this.nameSong;
    }

    public getId(): string{
        return this.id;
    }

}