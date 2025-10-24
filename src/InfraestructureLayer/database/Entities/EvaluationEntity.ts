import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { Evaluation } from "@domain/Enums";
import { ApprenticeEvaluationEntity } from "./ApprenticeEvaluationEntity";

@Entity()
export class EvaluationEntity {
  @PrimaryColumn()
  id!: string;

  @Column({ type: "date" })
  date!: Date;

  @Column({
    type: "enum",
    enum: Evaluation,
    default: Evaluation.BIEN,
  })
  evaluation!: Evaluation;

  @OneToMany(
    () => ApprenticeEvaluationEntity,
    (apprenticeEvaluation: ApprenticeEvaluationEntity) =>
      apprenticeEvaluation.evaluation
  )
  apprenticeEvaluations!: ApprenticeEvaluationEntity[];
}
