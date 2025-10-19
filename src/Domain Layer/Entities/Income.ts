import { v4 as uuidv4 } from "uuid";
import { DateValue, Money } from "../Value Objects/Values";

export class Income{
    constructor(
        private readonly ingressId: string = uuidv4(),
        private activityId: string,
        private mount: Money,
        private date: DateValue,
        private responsible: string
    ){

    }
    
    private getMount(): Money{
        return this.mount;
    }

    private getResponsible(): string{
        return this.responsible;
    }
}
