import { Entity, PrimaryColumn, Column } from 'typeorm';
import { Evaluation } from 'src/Domain Layer/Enums';
import { ApprenticeEvaluationEntity } from './Many To Many/ApprenticeEvaluationEntity';

@Entity()
export class EvaluationEntity {
  @PrimaryColumn()
  id!: string;

  @Column({ type: 'date' })
  date!: Date;

   @Column({
    type: 'enum',
    enum: Evaluation,
    default: Evaluation.BIEN,
    })
    evaluation!: Evaluation;

    @OneToMany(() => ApprenticeEvaluationEntity, (apprenticeEvaluation: ApprenticeEvaluationEntity) => apprenticeEvaluation.evaluation)
    apprenticeEvaluations!: ApprenticeEvaluationEntity[];
}