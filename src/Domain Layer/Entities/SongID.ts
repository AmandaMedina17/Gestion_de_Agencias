import { v4 as uuidv4 } from "uuid";
import { BillboardListEntity } from "./BillboardListEntity";

export class SongEntity{
    constructor(
        private readonly id: string = uuidv4(),
        private nameSong: string,
        private albumId: string
    )
    {

    }

    public getName(): string{
        return this.nameSong;
    }

    public getId(): string{
        return this.id;
    }

}