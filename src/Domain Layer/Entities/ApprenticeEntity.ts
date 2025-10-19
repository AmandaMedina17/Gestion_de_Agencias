import { DateValue } from "../Value Objects/Values";
import { v4 as uuidv4 } from "uuid";
import { ApprenticeStatus, ApprenticeTrainingLevel } from "../Enums";
import { EvaluationEntity } from "./EvaluationEntity";

export class ApprenticeEntity {
  private evaluations: EvaluationEntity[] = [];

  constructor(
    private readonly id: string = uuidv4(),
    private fullName: string,
    private age: number,
    private entryDate: DateValue,
    private trainingLevel: ApprenticeTrainingLevel,
    private status: ApprenticeStatus,
    private agencyId: string,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.fullName || this.fullName.trim().length === 0) {
      throw new Error("El nombre completo es requerido");
    }

    if (this.entryDate.isFuture()) {
      throw new Error("La fecha de ingreso no puede ser en el futuro");
    }
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
  public addEvaluation(evaluation: EvaluationEntity): void {
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

  public getJoinDate(): DateValue {
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
