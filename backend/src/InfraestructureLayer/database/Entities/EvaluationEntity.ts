import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { EvaluationValue } from "@domain/Enums";
import { ApprenticeEvaluationEntity } from "./ApprenticeEvaluationEntity";

@Entity()
export class EvaluationEntity {
  @PrimaryColumn()
  id!: string;

  @Column({ type: "date" })
  date!: Date;

  @Column({
    type: "enum",
    enum: EvaluationValue,
    default: EvaluationValue.BIEN,
  })
  evaluation!: EvaluationValue;

  @OneToMany(
    () => ApprenticeEvaluationEntity,
    (apprenticeEvaluation: ApprenticeEvaluationEntity) =>
      apprenticeEvaluation.evaluation
  )
  apprenticeEvaluations!: ApprenticeEvaluationEntity[];
}
