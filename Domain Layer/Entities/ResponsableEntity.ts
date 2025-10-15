import {ResponsableID } from "../ValueObjects";
export class ResponsibleEntity {
    constructor(
        private readonly id: ResponsableID,
        private name: string
    ) {
        this.validate();
    }

    private validate(): void {
        if (!this.id) {
            throw new Error('El ID del responsable es requerido');
        }
        if (!this.name || this.name.length == 0) {
            throw new Error('El nombre del responsable es requerido');
        }
        if (this.name.length < 2) {
            throw new Error('El nombre del responsable debe tener al menos 2 caracteres');
        }
        if (this.name.length > 100) {
            throw new Error('El nombre del responsable no puede exceder 100 caracteres');
        }
    }

    // Métodos útiles para el nombre
    public getFirstName(): string {
        return this.name.split(' ')[0];
    }

    public getLastName(): string {
        const parts = this.name.split(' ');
        return parts.length > 1 ? parts[parts.length - 1] : '';
    }

    public getInitials(): string {
        return this.name
            .split(' ')
            .map(part => part.charAt(0).toUpperCase())
            .join('');
    }

    // Getters
    public getId(): ResponsableID {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    // Métodos de negocio
    public toString(): string {
        return `${this.name.toString()} (${this.id.toString()})`;
    }

    public equals(other: ResponsibleEntity): boolean {
        return this.id.equals(other.id);
    }
}