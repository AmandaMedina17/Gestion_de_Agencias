import { DateValue } from "../Value Objects/Values";
import { DateID } from "../Value Objects/IDs";

export class DateEntity {
    constructor(
        private readonly id: DateID, 
        private date: DateValue
    )
    {
    }

    // ✅ MÉTODOS DE ESTADO

    public isToday(): boolean {
        return this.date.isToday();
    }

    public isPast(): boolean {
        return this.date.isPast();
    }

    public isFuture(): boolean {
        return this.date.isFuture();
    }

    public daysUntil(): number {
        return DateValue.today().differenceInDays(this.date);
    }

    public isUpcoming(daysThreshold: number = 30): boolean {
        const daysUntil = this.daysUntil();
        return daysUntil >= 0 && daysUntil <= daysThreshold;
    }

    // ✅ GETTERS

    public getId(): DateID {
        return this.id;
    }

    public getDate(): DateValue {
        return this.date;
    }

    public getDayOfWeek(): string {
        return this.date.getDayOfWeek();
    }

    public setDate(date: DateValue): void {
        this.date = date;
    }
}