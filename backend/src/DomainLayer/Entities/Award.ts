import { IUpdatable } from "@domain/UpdatableInterface";
import { UpdateData } from "@domain/UpdateData";
import { v4 as uuidv4 } from "uuid";
export class Award implements IUpdatable{
    constructor(
        private readonly id: string,
        private name: string,
        private date:Date,
    ){
        this.validateName();
    }
    update(updateDto: UpdateData): void {
        
        updateDto.name = updateDto.name != undefined ? updateDto.name : this.name
        updateDto.date = updateDto.date!= undefined ? updateDto.date : this.date

        const albumUpadte = Award.create(updateDto.nameSong,updateDto.date)
                
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

    public static create( name :string , date : Date) : Award{
        const id = uuidv4()
        return new Award(id, name,date);
      }
}
