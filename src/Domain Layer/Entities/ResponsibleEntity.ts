import { ResponsibleID } from "../Value Objects/IDs";

export class ResponsibleEntity{
    constructor(
        private readonly id: string,
        private name: string
    ){

    }

    public getId(): string{
        return this.id;
    }

    public getName(): string{
        return this.name;
    }
}