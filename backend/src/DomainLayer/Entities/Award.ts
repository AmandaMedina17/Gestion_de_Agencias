export class Award {
    constructor(
        private readonly id: string,
        private name: string,
        private date:Date
    ){
        this.validateName();
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
}