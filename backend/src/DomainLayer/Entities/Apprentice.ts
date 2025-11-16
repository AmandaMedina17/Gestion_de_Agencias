import { DateValue } from "../Value Objects/Values";
import { v4 as uuidv4 } from "uuid";
import { ApprenticeStatus, ApprenticeTrainingLevel } from "../Enums";
import { Evaluation } from "./Evaluation";
import { UpdateApprenticeDto } from "@application/DTOs/apprenticeDto/update-apprentice.dto";

export class Apprentice implements IUpdatable<UpdateApprenticeDto> {
  private evaluations: Evaluation[] = [];

  constructor(
    private readonly id: string,
    private fullName: string,
    private age: number,
    private entryDate: Date,
    private trainingLevel: ApprenticeTrainingLevel,
    private status: ApprenticeStatus,
  ) {
    this.validate();
  }

  update(updateDto: UpdateApprenticeDto): void {
    if(updateDto.fullName)
    {
      this.validate_name(updateDto.fullName);
      this.fullName = updateDto.fullName;
    }
    if(updateDto.age)
    {
      this.validate_age(updateDto.age);
      this.age = updateDto.age;
    }
    if(updateDto.status)
    {
      this.validate_status(updateDto.status);
      this.status = updateDto.status;
    }
    if(updateDto.trainingLevel)
    {
      this.validate_trainingLevel(updateDto.trainingLevel);
      this.trainingLevel = updateDto.trainingLevel;
    }
    if(updateDto.entryDate)
    {
      this.validate_entryDate(updateDto.entryDate);
      this.entryDate = updateDto.entryDate;
    }
  }

  static create(name: string, 
                age:number, 
                status: ApprenticeStatus, 
                trainingLevel: ApprenticeTrainingLevel, 
                entryDate: Date){
        const id = uuidv4();
        return new Apprentice(id, name, age, entryDate, trainingLevel, status);
  }

  private validate(): void {
    if (!this.fullName || this.fullName.trim().length === 0) {
      throw new Error("El nombre completo es requerido");
    }

    if (this.entryDate > new Date()) {
      throw new Error("La fecha de ingreso no puede ser en el futuro");
    }
  }

  private validate_name(name:string): void{
      if (name === null || name.trim() === "") {
        throw new Error("Name cannot be null or empty");
      }
  }

  private validate_age(age:number): void{
      if (age <18 || age > 80) {
        throw new Error("Age cannot be greater of 80");
      }
  }

  private validate_status(status: ApprenticeStatus): void{
      if(this.status == ApprenticeStatus.PROCESO_DE_SELECCION)
      {
        throw new Error("An apprentice cannot change status after being in the selection process.");
      }
      if(status == ApprenticeStatus.EN_ENTRENAMIENTO)
      {
        throw new Error("An apprentice cannot change to training status after being transferred.");
      }
      if(this.status == ApprenticeStatus.TRANSFERIDO)
      {
        throw new Error("An apprentice cannot change status after being transferred.");
      } 
  }

  private validate_trainingLevel(trainingLevel: ApprenticeTrainingLevel): void{

  }

  private validate_entryDate(entryDate:Date): void{
      
  }

  //promueve al aprendiz al siguiente nivel de entrenamiento
  public promoteToNextLevel(): void {
    const currentLevel = this.trainingLevel;

    switch (currentLevel) {
      case ApprenticeTrainingLevel.PRINCIPIANTE:
        this.trainingLevel = ApprenticeTrainingLevel.INTERMEDIO;
        break;
      case ApprenticeTrainingLevel.INTERMEDIO:
        this.trainingLevel = ApprenticeTrainingLevel.AVANZADO;
        break;
      case ApprenticeTrainingLevel.AVANZADO:
        throw new Error("El aprendiz ya está en el nivel más alto");
    }
  }

  //annadir evaluacion
  public addEvaluation(evaluation: Evaluation): void {
    this.evaluations.push(evaluation);
  }

  //cambiar estado del aprendiz
  public changeStatus(newStatus: ApprenticeStatus): void {
    const oldStatus = this.status;
    if (
      oldStatus == ApprenticeStatus.PROCESO_DE_SELECCION &&
      newStatus == ApprenticeStatus.EN_ENTRENAMIENTO
    ) {
      return; //despues de estar en proceso de seleccion no puede volver a entrenamiento
    } else if (oldStatus == ApprenticeStatus.TRANSFERIDO) {
      return; //un aprendiz transferido no puede tener otro estado dentro de la agencia
    } else {
      this.status = newStatus;
    }
  }

  public isEligibleForDebut(): boolean {
    return (
      this.trainingLevel === ApprenticeTrainingLevel.AVANZADO &&
      this.status === ApprenticeStatus.PROCESO_DE_SELECCION
    );
  }

  public getId(): string {
    return this.id;
  }

  public getFullName(): string {
    return this.fullName;
  }

  public getJoinDate(): Date {
    return this.entryDate;
  }

  public getTrainingLevel(): ApprenticeTrainingLevel {
    return this.trainingLevel;
  }

  public getStatus(): ApprenticeStatus {
    return this.status;
  }

  public getAge(): number {
    return this.age;
  }

  
}
