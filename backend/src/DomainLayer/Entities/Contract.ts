import { IUpdatable } from "@domain/UpdatableInterface";
import { ContractStatus } from "../Enums";
import { Agency } from "./Agency";
import { Artist } from "./Artist";
import { v4 as uuidv4 } from 'uuid';
import { UpdateData } from "@domain/UpdateData";

export class Contract implements IUpdatable{
  constructor(
    private readonly id: string,
    private startDate: Date,
    private endDate: Date | null,
    private readonly agency: Agency,
    private readonly artist: Artist,
    private distributionPercentage: number,
    private status: ContractStatus,
    private conditions: string
  ) {
    this.validate();
  }
  static create(startDate: Date,endDate: Date, agency: Agency, artist: Artist,distributionPercentage: number, status: ContractStatus, conditions: string) : Contract{
    const id = uuidv4();
    return new Contract(id,startDate,endDate,agency,artist,distributionPercentage,status,conditions);
  }
  
  update(updateDto: UpdateData): void {
    if(updateDto.distributionPercentage)
      {
        this.validate_ditributionPercentage(updateDto.distributionPercentage);
        this.changeDistributionPercentage(updateDto.distributionPercentage);
      }
      if(updateDto.conditions)
      {
        this.validate_conditions(updateDto.conditions);
        this.updateConditions(updateDto.conditions);
      }
      if(updateDto.endDate && updateDto.startDate)
      {
        this.validateContractDates(updateDto.startDate,updateDto.endDate);
        this.startDate = updateDto.startDate;
        this.endDate = updateDto.endDate; 
      }
      if(updateDto.status)
      {
        this.status = updateDto.status;
      }
  }
  validate_ditributionPercentage(distributionPercentage: number) {
    if (!distributionPercentage) {
      throw new Error("The distribution percentage is requerid");
    }
    if (distributionPercentage <= 0)
    {
      throw new Error("The distribution percentage must be greater than zero")
    }

  }
  validate_conditions(conditions: string) {
    if (!conditions || conditions.length == 0) {
      throw new Error("The contract conditions are required");
    }
  }

  private validate(): void {
    if (!this.id) {
      throw new Error("The contract ID is required");
    }
    if (!this.agency) {
      throw new Error("The agency is required");
    }
    if (!this.artist) {
      throw new Error("The artist is required");
    }
    if (!this.status) {
      throw new Error("The contract status is required");
    }
    this.validate_ditributionPercentage(this.distributionPercentage);
    this.validate_conditions(this.conditions);
    this.validateContractDates(this.startDate,this.endDate);
  }
  private validateContractDates(startDate: Date, endDate?: Date | null): void {
    if (!startDate) {
      throw new Error("The start date is required");
    }
    if (endDate && startDate >= endDate) {
      throw new Error("The start date cannot be before the end date ");
    }
    // // El contrato no puede empezar antes del debut del artista
    // if (startDate < this.artist.getDebutDate()) {
    //   throw new Error(
    //     "The contract cannot start before the artist debut");
    // }
    // if(startDate < this.agency.getDateFundation()) {
    //   throw new Error("The contract cannot start before the agency creation")
    // }
  }

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
    // if (this.status !== ContractStatus.EN_RENOVACION) {
    //   throw new Error(
    //     "The percentage can only be modified in contracts under negotiation."
    //   );
    // }
    this.distributionPercentage = newPercentage;
  }

  // Método para actualizar las condiciones (solo en renovacion)
  public updateConditions(newConditions: string): void {
    // if (this.status !== ContractStatus.EN_RENOVACION) {
    //   throw new Error(
    //     "Conditions can only be updated in contracts under negotiation."
    //   );
    // }
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

  // public extendContract(extensionDays: number): void {
  //   if (
  //     this.status !== ContractStatus.EN_RENOVACION &&
  //     this.status !== ContractStatus.ACTIVO
  //   ) {
  //     throw new Error(
  //       "Only active or renewal contracts can be extended"
  //     );
  //   }
  //   // Crear nueva fecha extendida
  //   const newEndDate = new Date(this.endDate.getDate() + extensionDays);
  //   (this as any).endDate = newEndDate; //para poder modificar ya que es readonly
  //   this.underRenewal();
  // }

  // public shortenContract(reductionDays: number): void {
  //   if (this.status !== ContractStatus.EN_RENOVACION) {
  //     throw new Error("Contracts can only be shortened during renewal.");
  //   }
    
  //   const newEndDate = new Date(this.endDate.getDate() - reductionDays);

  //   // Verificar que la nueva fecha no sea anterior a la fecha de inicio
  //   if (newEndDate <= this.startDate) {
  //     throw new Error("The completion date cannot be earlier than the start date");
  //   }
    
  //   (this as any).endDate = newEndDate;
  // }

  // // MÉTODOS DE VIGENCIA TEMPORAL
  //   public isCurrentlyActive(): boolean {
  //   const now = new Date();
  //   return this.isActive() && now >= this.startDate && now <= this.endDate;
  // }

  public willStartInFuture(): boolean {
    return new Date() < this.startDate;
  }

  // public hasEnded(): boolean {
  //   const now = new Date();
  //   return now > this.endDate || this.isExpired() || this.isTerminated();
  // }

  public daysUntilStart(): number {
    const now = new Date();
    const diffTime = this.startDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // public daysUntilEnd(): number {
  //   const now = new Date();
  //   const diffTime = this.endDate.getTime() - now.getTime();
  //   return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  // }

  // public isActiveOnDate(date: Date): boolean {
  //   return this.isActive() && date >= this.startDate && date <= this.endDate;
  // }
  // MÉTODOS DE DURACIÓN
  // public getContractDurationInDays(): number {
  //   const diffTime = this.endDate.getTime() - this.startDate.getTime();
  //   return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  // }

  // public getContractDurationInMonths(): number {
  //   const startYear = this.startDate.getFullYear();
  //   const startMonth = this.startDate.getMonth();
  //   const endYear = this.endDate.getFullYear();
  //   const endMonth = this.endDate.getMonth();
    
  //   return (endYear - startYear) * 12 + (endMonth - startMonth);
  // }

  // public getContractDurationInYears(): number {
  //   const startYear = this.startDate.getFullYear();
  //   const endYear = this.endDate.getFullYear();
  //   const yearDiff = endYear - startYear;
    
  //   // Ajustar si el mes/dura del endDate es anterior al del startDate en el mismo año
  //   const startMonth = this.startDate.getMonth();
  //   const endMonth = this.endDate.getMonth();
  //   const startDay = this.startDate.getDate();
  //   const endDay = this.endDate.getDate();
    
  //   if (endMonth < startMonth || (endMonth === startMonth && endDay < startDay)) {
  //     return yearDiff - 1;
  //   }
    
  //   return yearDiff;
  // }

  // Getters
  public getId(): string {
    return this.id;
  }

  public getStartDate(): Date {
    return this.startDate;
  }

  public getEndDate(): Date | null {
    return this.endDate;
  }

  public getAgencyId(): Agency{
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
