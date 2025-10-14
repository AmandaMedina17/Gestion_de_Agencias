import { GroupStatus } from "../Enums";
import {GroupID, DateValue} from "../ValueObjects";

export class GroupEntity {
    constructor(
        private readonly id: GroupID,
        private name: string,
        private status: GroupStatus,
        private debut_date: DateValue,
        private members: number,
        private concept: string,
        private is_reated: boolean
    ) {
        this.validate();
    }

    private validate(): void {
        if (!this.id) {
            throw new Error('El ID del premio es requerido');
        }
        if (!this.name || this.name.length == 0) {
            throw new Error('El nombre del premio es requerido');
        }
        if (this.name.length < 2) {
            throw new Error('El nombre del premio debe tener al menos 2 caracteres');
        }
        if (this.name.length > 200) {
            throw new Error('El nombre del premio no puede exceder 200 caracteres');
        }
        if(!this.concept || this.concept.length == 0){
            throw new Error('El concepto del grupo es requerido')
        }
        if(!this.members || this.members < 2)
        {
            throw new Error('Tiene que haber al menos dos miembros en el grupo')
        }
        if(!this.status){
            throw new Error('El estado del grupo es requerido')
        }
    }


    // Getters
    public getId(): GroupID {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }
    public getNumberOfMember(): number{
        return this.members;
    }

    public getDebutDate(): DateValue {
        return this.debut_date;
    }
    public getStatus(): GroupStatus{
        return this.status;
    }
    public isCreated(): boolean{
        return this.is_reated;
    }
    public getConcept(): string{
        return this.concept;
    }

    // Métodos de negocio específicos para premios K-pop
    public isRecentGroup(): boolean {
        // Un premio es considerado "reciente" si fue en los últimos 2 años
        const twoYearsAgo = DateValue.today().getYear() - 2;
        return this.debut_date.getYear() >= twoYearsAgo;
    }

    public getYearsSinceDebut(): number {
        return DateValue.today().getYear() - this.debut_date.getYear();
    }

    public toString(): string {
        return `${this.name.toString()}`;
    }
    
}

