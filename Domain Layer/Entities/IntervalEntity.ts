import { IntervalID, DateValue } from "../ValueObjects";

export class IntervalEntity {
    constructor(
        private readonly id: IntervalID,
        private startDate: DateValue,
        private endDate: DateValue,
    ) {
        this.validate();
    }

    private validate(): void {
        if (this.endDate.isBefore(this.startDate)) {
            throw new Error('La fecha final no puede ser anterior a la fecha de inicio');
        }

        if (this.startDate.equals(this.endDate)) {
            throw new Error('El intervalo debe tener al menos un día de duración');
        }

        // // Validar duración máxima (2 años por ejemplo)
        // if (this.getDurationInDays() > 730) {
        //     throw new Error('El intervalo no puede exceder los 2 años de duración');
        // }
    }

    //MÉTODOS DE NEGOCIO ESPECÍFICOS

    /**
     * Verifica si el intervalo es adecuado para un período de entrenamiento
     */
    public isSuitableForTraining(): boolean {
        const durationDays = this.getDurationInDays();
        
        // Períodos de entrenamiento típicamente entre 3 meses y 2 años
        return durationDays >= 90 && durationDays <= 730;
    }

    /**
     * Verifica si el intervalo es adecuado para promociones
     * (generalmente 4-8 semanas)
     */
    public isSuitableForPromotion(): boolean {
        const durationDays = this.getDurationInDays();
        return durationDays >= 28 && durationDays <= 56;
    }

    /**
     * Verifica si una fecha específica está dentro del intervalo
     */
    public containsDate(date: DateValue): boolean {
        return (date.equals(this.startDate) || date.isAfter(this.startDate)) &&
               (date.equals(this.endDate) || date.isBefore(this.endDate));
    }

    /**
     * Verifica si este intervalo se superpone con otro
     */
    public overlapsWith(other: IntervalEntity): boolean {
        return (this.startDate.isBefore(other.endDate) || this.startDate.equals(other.endDate)) &&
               (this.endDate.isAfter(other.startDate) || this.endDate.equals(other.startDate));
    }

    /**
     * Calcula la duración en días
     */
    public getDurationInDays(): number {
        return this.startDate.differenceInDays(this.endDate);
    }

    /**
     * Calcula la duración en meses
     */
    public getDurationInMonths(): number {
        const startYear = this.startDate.getYear();
        const startMonth = this.startDate.getMonth();
        const endYear = this.endDate.getYear();
        const endMonth = this.endDate.getMonth();
        
        return (endYear - startYear) * 12 + (endMonth - startMonth);
    }

    /**
     * Obtiene todas las fechas dentro del intervalo
     */
    public getAllDatesInInterval(): DateValue[] {
        const dates: DateValue[] = [];
        let currentDate = new Date(this.startDate.valueOf());
        
        while (currentDate <= new Date(this.endDate.valueOf())) {
            dates.push(DateValue.fromString(currentDate.toISOString().split('T')[0]));
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
        
        const newEndDate = new Date(this.endDate.valueOf());
        newEndDate.setDate(newEndDate.getDate() + days);
        
        this.endDate = DateValue.fromString(newEndDate.toISOString().split('T')[0]);
        this.validate();
    }

    /**
     * Acorta el intervalo en una cantidad específica de días
     */
    public shortenInterval(days: number): void {
        if (days <= 0) {
            throw new Error('Los días de acortamiento deben ser positivos');
        }
        
        const newEndDate = new Date(this.endDate.valueOf());
        newEndDate.setDate(newEndDate.getDate() - days);
        
        if (newEndDate <= new Date(this.startDate.valueOf())) {
            throw new Error('No se puede acortar el intervalo por debajo de un día de duración');
        }
        
        this.endDate = DateValue.fromString(newEndDate.toISOString().split('T')[0]);
        this.validate();
    }

    // ✅ MÉTODOS DE ESTADO

    public isActive(): boolean {
        const today = DateValue.today();
        return this.containsDate(today);
    }

    public isFuture(): boolean {
        return this.startDate.isFuture();
    }

    public isPast(): boolean {
        return this.endDate.isPast();
    }

    public daysUntilStart(): number {
        return DateValue.today().differenceInDays(this.startDate);
    }

    public daysUntilEnd(): number {
        return DateValue.today().differenceInDays(this.endDate);
    }

    //GETTERS

    public getId(): IntervalID {
        return this.id;
    }

    public getStartDate(): DateValue {
        return this.startDate;
    }

    public getEndDate(): DateValue {
        return this.endDate;
    }

    //SETTERS CON VALIDACIÓN

    public setStartDate(newStartDate: DateValue): void {
        if (newStartDate.isAfter(this.endDate)) {
            throw new Error('La fecha de inicio no puede ser posterior a la fecha final');
        }
        
        this.startDate = newStartDate;
        this.validate();
    }

    public setEndDate(newEndDate: DateValue): void {
        if (newEndDate.isBefore(this.startDate)) {
            throw new Error('La fecha final no puede ser anterior a la fecha de inicio');
        }
        
        this.endDate = newEndDate;
        this.validate();
    }

    public toString(): string {
        return `${this.startDate.toLocalString()} - ${this.endDate.toLocalString}`;
    }

    public toDetailedString(): string {
        return `[${this.id.toString()}] ${this.startDate.toLocalString()} - ${this.endDate.toLocalString()} (${this.getDurationInDays()} días)`;
    }
}