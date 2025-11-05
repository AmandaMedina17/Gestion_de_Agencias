import { v4 as uuidv4 } from 'uuid';

export class Responsible{
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

      if (this.name === null) {
        throw new Error("Name cannot be null");
      }
    }

    static create( name: string): Responsible {
      const id = uuidv4();
      return new Responsible(id, name);
    }

    public getId(): string{
        return this.id;
    }

    public getName(): string{
        return this.name;
    }
}