import { DateValue } from "../Value Objects/Values";
import { v4 as uuidv4 } from 'uuid';

export class Interval {
    constructor(
        private readonly id: string,
        private startDate: Date,
        private endDate: Date,
    ) {
        this.validate();
    }
    
    public create(startDate: Date, endDate: Date) : Interval {
        const id =  uuidv4();
        return new Interval(id, startDate, endDate);
    }
    private validate(): void {
        if (this.endDate < this.startDate) {
            throw new Error('La fecha final no puede ser anterior a la fecha de inicio');
        }

        const startWithoutTime = new Date(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate());
        const endWithoutTime = new Date(this.endDate.getFullYear(), this.endDate.getMonth(), this.endDate.getDate());
        
        if (startWithoutTime.getTime() === endWithoutTime.getTime()) {
            throw new Error('El intervalo debe tener al menos un día de duración');
        }
    }

    /**
     * Verifica si una fecha específica está dentro del intervalo
     */
    public containsDate(date: Date): boolean {
        const dateWithoutTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const startWithoutTime = new Date(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate());
        const endWithoutTime = new Date(this.endDate.getFullYear(), this.endDate.getMonth(), this.endDate.getDate());
        
        return dateWithoutTime >= startWithoutTime && dateWithoutTime <= endWithoutTime;
    }

    /**
     * Verifica si este intervalo se superpone con otro
     */
    public overlapsWith(other: Interval): boolean {
        return (this.startDate < other.endDate || this.startDate == other.endDate) &&
               (this.endDate < other.startDate || this.endDate == other.startDate);
    }

    /**
     * Calcula la duración en días
     */
    public getDurationInDays(): number {
        const start = new Date(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate());
        const end = new Date(this.endDate.getFullYear(), this.endDate.getMonth(), this.endDate.getDate());
        
        const diffTime = Math.abs(end.getTime() - start.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Calcula la duración en meses
     */
    public getDurationInMonths(): number {
        const startYear = this.startDate.getFullYear();
        const startMonth = this.startDate.getMonth();
        const endYear = this.endDate.getFullYear();
        const endMonth = this.endDate.getMonth();
        
        return (endYear - startYear) * 12 + (endMonth - startMonth);
    }

    /**
     * Obtiene todas las fechas dentro del intervalo
     */
    public getAllDatesInInterval(): Date[] {
        const dates: Date[] = [];
        const currentDate = new Date(this.startDate);
        
        // Normalizar a medianoche para evitar problemas de hora
        currentDate.setHours(0, 0, 0, 0);
        const endDateNormalized = new Date(this.endDate);
        endDateNormalized.setHours(0, 0, 0, 0);
        
        while (currentDate <= endDateNormalized) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return dates;
    }

    /**
     * Extiende el intervalo en una cantidad específica de días
     */
    public extendInterval(days: number): void {
        if (days <= 0) {
            throw new Error('Los días de extensión deben ser positivos');
        }
        
        const newEndDate = new Date(this.endDate);
        newEndDate.setDate(newEndDate.getDate() + days);
        
        this.endDate = newEndDate;
        this.validate();
    }

    /**
     * Acorta el intervalo en una cantidad específica de días
     */
    public shortenInterval(days: number): void {
        if (days <= 0) {
            throw new Error('Los días de acortamiento deben ser positivos');
        }
        
        const newEndDate = new Date(this.endDate);
        newEndDate.setDate(newEndDate.getDate() - days);
        
        if (newEndDate <= this.startDate) {
            throw new Error('No se puede acortar el intervalo por debajo de un día de duración');
        }
        
        this.endDate = newEndDate;
        this.validate();
    }

    // MÉTODOS DE ESTADO

    public isActive(): boolean {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalizar a medianoche
        return this.containsDate(today);
    }

    public isFuture(): boolean {
        return this.startDate > new Date();
    }

    public isPast(): boolean {
        return this.endDate < new Date();
    }

    public daysUntilStart(): number {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startWithoutTime = new Date(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate());
        
        const diffTime = Math.abs(startWithoutTime.getTime() - today.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    public daysUntilEnd(): number {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endWithoutTime = new Date(this.endDate.getFullYear(), this.endDate.getMonth(), this.endDate.getDate());
        
        const diffTime = Math.abs(endWithoutTime.getTime() - today.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    //GETTERS

    public getId(): string {
        return this.id;
    }

    public getStartDate(): Date {
        return this.startDate;
    }

    public getEndDate(): Date {
        return this.endDate;
    }

    //SETTERS CON VALIDACIÓN

    public setStartDate(newStartDate: Date): void {
        if (newStartDate > this.endDate) {
            throw new Error('La fecha de inicio no puede ser posterior a la fecha final');
        }
        
        this.startDate = newStartDate;
        this.validate();
    }

    public setEndDate(newEndDate: Date): void {
        if (newEndDate < this.startDate) {
            throw new Error('La fecha final no puede ser anterior a la fecha de inicio');
        }
        
        this.endDate = newEndDate;
        this.validate();
    }
}