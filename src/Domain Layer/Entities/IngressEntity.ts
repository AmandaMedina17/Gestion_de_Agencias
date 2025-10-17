import { IngressID, ActivityID } from "../Value Objects/IDs";
import { DateValue, Money } from "../Value Objects/Values";

export class IngressEntity{
    constructor(
        private readonly ingressId: IngressID,
        private activity: ActivityID,
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
