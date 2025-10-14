import { DateValue, DateID } from "../ValueObjects";

export class DateEntity {
    constructor(
        private readonly id: number, // O puedes crear un DateID similar a los otros
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

    public getId(): number {
        return this.id;
    }

    public getDate(): DateValue {
        return this.date;
    }

    public getDayOfWeek(): string {
        return this.date.getDayOfWeek();
    }

    // ✅ SETTERS

    public setDate(date: DateValue): void {
        this.date = date;
    }

    // ✅ REPRESENTACIÓN

    public toString(): string {
        return `[${this.id}] ${this.date.toLocalString()}`;
    }
}