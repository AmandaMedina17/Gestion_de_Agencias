import { UpdatePlaceDto } from '@application/DTOs/placeDto/update-place.dto';
import { v4 as uuidv4 } from 'uuid';

export class Place implements IUpdatable<UpdatePlaceDto>{
    constructor(
      private readonly id: string,
      private name: string
    ){
      this.validate();
    }

    private validate(): void {
      if (!this.id || this.id.trim() === "") {
        throw new Error("ID cannot be null or empty");
      }
      this.validate_name(this.name)
    }

    static create( name: string): Place {
      const id = uuidv4();
      return new Place(id, name);
    }

    update(updateDto: UpdatePlaceDto){
      if(updateDto.name)
      {
        this.validate_name(updateDto.name);
        this.name = updateDto.name;
      }
    }

    private validate_name(name:string): void{
      if (name === null || name.trim() === "") {
        throw new Error("Name cannot be null or empty");
      }
    }

    public getId(): string { return this.id; }
    
    public getName(): string { return this.name; }

}