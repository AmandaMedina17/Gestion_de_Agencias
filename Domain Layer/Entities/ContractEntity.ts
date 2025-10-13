import { ContractStatus } from "../Enums";
import { ContractID, DateValue,AgencyID,ArtistID } from "../ValueObjects"; //Corroborar con medina
export class ContractEntity {
    constructor(
        private readonly id: ContractID,
        private readonly date: DateValue,
        private readonly agencyId: AgencyID,
        private readonly artistId: ArtistID,
        private distributionPercentage: string,
        private status: ContractStatus,
        private conditions: string
    ) {
        this.validate();
    }

    private validate(): void {
        if (!this.id) {
            throw new Error('El ID del contrato es requerido');
        }
        if (!this.date) {
            throw new Error('La fecha del contrato es requerida');
        }
        if (!this.agencyId) {
            throw new Error('El ID de la agencia es requerido');
        }
        if (!this.artistId) {
            throw new Error('El ID del artista es requerido');
        }
        if (!this.distributionPercentage) {
            throw new Error('El porcentaje de distribución es requerido');
        }
        if (!this.status) {
            throw new Error('El estado del contrato es requerido');
        }
        if (!this.conditions || this.conditions.length == 0) {
            throw new Error('Las condiciones del contrato son requeridas');
        }

        // Validaciones de negocio específicas
        this.validateContractDate();
    }

    private validateContractDate(): void {
        // El contrato no puede ser en el futuro
        if (this.date.isFuture()) {
            throw new Error('La fecha del contrato no puede ser en el futuro');
        }

        // El contrato no puede ser hace más de 50 años (por ejemplo)
        const fiftyYearsAgo = DateValue.today().getYear() - 50;
        if (this.date.getYear() < fiftyYearsAgo) {
            throw new Error('La fecha del contrato no puede ser hace más de 50 años');
        }
    }

    // Métodos para modificar el estado del contrato
    public activate(): void {
        this.status = ContractStatus.ACTIVE;
    }

    public expire(): void {
        this.status = ContractStatus.FINISHED;
    }

    public underRenewal(): void {
        this.status = ContractStatus.UNDER_RENEWAL;
    }

    public terminate(): void {
        this.status = ContractStatus.TERMINATED;
    }

    // Método para cambiar el porcentaje de distribución (solo en renovacion)
    public changeDistributionPercentage(newPercentage: string): void {
        if (this.status !== ContractStatus.UNDER_RENEWAL) {
            throw new Error('Solo se puede modificar el porcentaje en contratos en negociación');
        }
        this.distributionPercentage = newPercentage;
    }

    // Método para actualizar las condiciones (solo en renovacion)
    public updateConditions(newConditions: string): void {
        if (this.status !== ContractStatus.UNDER_RENEWAL) {
            throw new Error('Solo se pueden actualizar las condiciones en contratos en negociación');
        }
        this.conditions = newConditions;
    }

    // Métodos de consulta de negocio
    public isActive(): boolean {
        return this.status === ContractStatus.ACTIVE;
    }

    public isExpired(): boolean {
        return this.status === ContractStatus.TERMINATED;
    }

    public isUnderRenewal(): boolean {
        return this.status === ContractStatus.UNDER_RENEWAL;
    }

    public getContractDurationInYears(): number {
        return DateValue.today().getYear() - this.date.getYear();
    }

    // Getters
    public getId(): ContractID {
        return this.id;
    }

    public getDate(): DateValue {
        return this.date;
    }

    public getAgencyId(): AgencyID {
        return this.agencyId;
    }

    public getArtistId(): ArtistID {
        return this.artistId;
    }

    public getDistributionPercentage(): string {
        return this.distributionPercentage;
    }

    public getStatus(): ContractStatus {
        return this.status;
    }

    public getConditions(): string {
        return this.conditions;
    }

    public toString(): string {
        return `Contrato ${this.id.toString()} - Artista: ${this.artistId.toString()}, Agencia: ${this.agencyId.toString()}, Estado: ${this.status}`;
    }
}