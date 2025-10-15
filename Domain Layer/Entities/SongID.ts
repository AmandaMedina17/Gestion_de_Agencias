import { SongID, BillboardID } from "../ValueObjects";
import { BillboardListEntity } from "./BillboardListEntity";

export class SongEntity{
    private positionsBillboard: Map<BillboardListEntity, number> = new Map();

    constructor(
        private readonly id: SongID,
        private nameSong: string
        // poner album
    )
    {

    }

    //para annadir una posicion en una lista hay que comprobar que el album tiene 1 anno
    public addPositionBillboard(list: BillboardListEntity, position: number):void{
        if(position > 0 && position<=list.getEndList())
        {
            this.positionsBillboard.set(list, position);
        }
        else{
            throw new Error("Posicion no valido para la lista " + list.getNameList());
            
        }
    }

    public getName(): string{
        return this.nameSong;
    }

    public getId(): SongID{
        return this.id;
    }

    public getPositionInList(list: BillboardListEntity): number{
        const post = this.positionsBillboard.get(list);
        if(post!=undefined)
        {
            return post;
        }
        throw new Error("Esta cancion no tiene un puesto en esta lista " + list.getNameList());
    }


}