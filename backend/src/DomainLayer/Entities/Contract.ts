import { ContractStatus } from "../Enums";
import { DateValue } from "../Value Objects/Values";
import { Agency } from "./Agency";
import { Artist } from "./Artist";
import { Interval } from "./Interval";
import { v4 as uuidv4 } from "uuid";

export class Contract {
  constructor(
    private readonly id: string,
    private readonly interval: Interval,
    private readonly agency: Agency,
    private readonly artist: Artist,
    private distributionPercentage: number,
    private status: ContractStatus,
    private conditions: string
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.id) {
      throw new Error("El ID del contrato es requerido");
    }
    if (!this.interval) {
      throw new Error("El intervalo del contrato es requerido");
    }
    if (!this.agency) {
      throw new Error("La agencia es requerida");
    }
    if (!this.artist) {
      throw new Error("El artista es requerido");
    }
    if (!this.distributionPercentage) {
      throw new Error("El porcentaje de distribución es requerido");
    }
    if (!this.status) {
      throw new Error("El estado del contrato es requerido");
    }
    if (!this.conditions || this.conditions.length == 0) {
      throw new Error("Las condiciones del contrato son requeridas");
    }
    // this.validateContractDates();
  }

  // static create( interval: Interval, agency: Agency, artist: Artist, distributionPercentage: number, status: ContractStatus, conditions: string): Contract {
  //   const id = uuidv4();
  //   return new Contract(id, interval, agency, artist, distributionPercentage,status,conditions);
  // private validateContractDates(): void {
  //   // El contrato no puede empezar antes del debut del artista
  //   // if (this.interval.getStartDate().isBefore(this.artist.getDebutDate())) {
  //   //   throw new Error(
  //   //     "El contrato no puede empezar antes del debut del artista"
  //   //   );
  //   // }
  //   //Decirle a medina
  //   // // El contrato no puede empezar antes de la fundación de la agencia
  //   // if (this.interval.getStartDate().isBefore(this.agency.getDateFundation())) {
  //   //     throw new Error('El contrato no puede empezar antes de la fundación de la agencia');
  //   // }
  // }
  
  // private validateContractDates(): void {
  //   // El contrato no puede empezar antes del debut del artista
  //   if (this.interval.getStartDate().isBefore(this.artist.getDebutDate())) {
  //     throw new Error(
  //       "El contrato no puede empezar antes del debut del artista"
  //     );
  //   }
  // }

  // Métodos para modificar el estado del contrato
  public activate(): void {
    this.status = ContractStatus.ACTIVO;
  }

  public expire(): void {
    this.status = ContractStatus.FINALIZADO;
  }

  public underRenewal(): void {
    this.status = ContractStatus.EN_RENOVACION;
  }

  public terminate(): void {
    this.status = ContractStatus.RESCINDIDO;
  }

  // Método para cambiar el porcentaje de distribución (solo en renovacion)
  public changeDistributionPercentage(newPercentage: number): void {
    if (this.status !== ContractStatus.EN_RENOVACION) {
      throw new Error(
        "Solo se puede modificar el porcentaje en contratos en negociación"
      );
    }
    this.distributionPercentage = newPercentage;
  }

  // Método para actualizar las condiciones (solo en renovacion)
  public updateConditions(newConditions: string): void {
    if (this.status !== ContractStatus.EN_RENOVACION) {
      throw new Error(
        "Solo se pueden actualizar las condiciones en contratos en negociación"
      );
    }
    this.conditions = newConditions;
  }

  // Métodos de consulta de negocio
  public isActive(): boolean {
    return this.status === ContractStatus.ACTIVO;
  }

  public isExpired(): boolean {
    return this.status === ContractStatus.FINALIZADO;
  }

  public isUnderRenewal(): boolean {
    return this.status === ContractStatus.EN_RENOVACION;
  }

  public isTerminated(): boolean {
    return this.status === ContractStatus.RESCINDIDO;
  }

  public extendContract(extensionDays: number): void {
    if (
      this.status !== ContractStatus.EN_RENOVACION &&
      this.status !== ContractStatus.ACTIVO
    ) {
      throw new Error(
        "Solo se puede extender contratos activos o en renovación"
      );
    }
    this.interval.extendInterval(extensionDays);
    this.underRenewal();
  }

  public shortenContract(reductionDays: number): void {
    if (this.status !== ContractStatus.EN_RENOVACION) {
      throw new Error("Solo se puede acortar contratos en renovación");
    }
    this.interval.shortenInterval(reductionDays);
  }

  // MÉTODOS DE VIGENCIA TEMPORAL
  public isCurrentlyActive(): boolean {
    return this.isActive() && this.interval.isActive();
  }

  public willStartInFuture(): boolean {
    return this.interval.isFuture();
  }

  public hasEnded(): boolean {
    return this.interval.isPast() || this.isExpired() || this.isTerminated();
  }

  public daysUntilStart(): number {
    return this.interval.daysUntilStart();
  }

  public daysUntilEnd(): number {
    return this.interval.daysUntilEnd();
  }

  public isActiveOnDate(date: DateValue): boolean {
    return this.isActive() && this.interval.containsDate(date);
  }

  // MÉTODOS DE DURACIÓN
  public getContractDurationInDays(): number {
    return this.interval.getDurationInDays();
  }

  public getContractDurationInMonths(): number {
    return this.interval.getDurationInMonths();
  }

  public getContractDurationInYears(): number {
    return Math.floor(this.interval.getDurationInMonths() / 12);
  }

  // Getters
  public getId(): string {
    return this.id;
  }

  public getInterval(): Interval {
    return this.interval;
  }

  public getAgencyId(): Agency {
    return this.agency;
  }

  public getArtistId(): Artist {
    return this.artist;
  }

  public getDistributionPercentage(): number {
    return this.distributionPercentage;
  }

  public getStatus(): ContractStatus {
    return this.status;
  }

  public getConditions(): string {
    return this.conditions;
  }
}