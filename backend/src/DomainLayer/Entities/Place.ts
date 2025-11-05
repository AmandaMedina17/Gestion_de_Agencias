import { v4 as uuidv4 } from 'uuid';

export class Place{
    constructor(
      private readonly id: string,
      private readonly name: string
    ){
      this.validate();
    }

    private validate(): void {
      if (!this.id || this.id.trim() === "") {
        throw new Error("ID cannot be null or empty");
      }

      if (this.name === null) {
        throw new Error("Name cannot be null");
      }
    }

    static create( name: string): Place {
      const id = uuidv4();
      return new Place(id, name);
    }

    public getId(): string { return this.id; }
    
    public getName(): string { return this.name; }

}