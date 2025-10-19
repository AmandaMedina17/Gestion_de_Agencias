import { ResponsibleID } from "../Value Objects/IDs";

export class ResponsibleEntity{
    constructor(
        private readonly id:ResponsibleID,
        private name: string
    ){

    }

    public getId(): ResponsibleID{
        return this.id;
    }

    public getName(): string{
        return this.name;
    }
}