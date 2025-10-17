import { SongID, BillboardID, AlbumID } from "../Value Objects/IDs";
import { BillboardListEntity } from "./BillboardListEntity";

export class SongEntity{
    constructor(
        private readonly id: SongID,
        private nameSong: string,
        private album: AlbumID
    )
    {

    }

    public getName(): string{
        return this.nameSong;
    }

    public getId(): SongID{
        return this.id;
    }

}