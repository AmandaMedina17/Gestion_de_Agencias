import { Entity, ManyToOne, Column, JoinColumn, PrimaryColumn } from "typeorm";
import { ApprenticeEntity } from "./ApprenticeEntity";
import { DateEntity } from "./DateEntity";
import { EvaluationValue } from "../../../DomainLayer/Enums";

@Entity("apprentice_evaluation")
export class ApprenticeEvaluationEntity {
  
  @PrimaryColumn("uuid", { name: "apprentice_id" })
  apprenticeId!: string;

  @PrimaryColumn("uuid", { name: "date_id" })
  dateId!: string;

  @ManyToOne(() => ApprenticeEntity, apprentice => apprentice.evaluations, { eager: false })
  @JoinColumn({ name: "apprentice_id" })
  apprentice!: ApprenticeEntity;

  @ManyToOne(() => DateEntity, { eager: false })
  @JoinColumn({ name: "date_id" })
  date!: DateEntity;

  @Column({
    type: "enum",
    enum: EvaluationValue,
  })
  evaluation!: EvaluationValue;
}
