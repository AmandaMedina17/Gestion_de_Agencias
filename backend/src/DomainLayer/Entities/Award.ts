import { IUpdatable } from "@domain/UpdatableInterface";
import { UpdateData } from "@domain/UpdateData";
import { v4 as uuidv4 } from "uuid";
export class Award implements IUpdatable{
    constructor(
        private readonly id: string,
        private name: string,
        private date:Date,
        private album:string
    ){
        this.validateName();
    }
    update(updateDto: UpdateData): void {
        
        updateDto.name = updateDto.name != undefined ? updateDto.name : this.name
        updateDto.date = updateDto.date!= undefined ? updateDto.date : this.date
        updateDto.album = updateDto.album!= undefined ? updateDto.album : this.album

        const albumUpadte = Award.create(updateDto.nameSong,updateDto.date,updateDto.album)
                
        this.name = albumUpadte.name
        this.date = albumUpadte.date  
    }

    public validateName () : void{
        if (!this.name || this.name.trim().length === 0) 
            throw new Error("Name of award can't be undefined or empty");
    }

    public getId(): string{
        return this.id;
    }

    public getName(): string{
        return this.name;
    }

    public getDate(): Date{
        return this.date;
    }

    public getAlbumId(): string{
        return this.album;
    }

    public static create( name :string , date : Date, album:string) : Award{
        const id = uuidv4()
        return new Award(id, name,date,album);
      }
}
