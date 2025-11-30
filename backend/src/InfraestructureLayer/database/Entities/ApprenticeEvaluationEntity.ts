import { Entity, Column,PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApprenticeEntity } from './ApprenticeEntity';
import { EvaluationEntity } from './EvaluationEntity';
import { EvaluationValue
  
 } from '@domain/Enums';
@Entity('apprentice_evaluation')
export class ApprenticeEvaluationEntity {
    // Llave primaria compuesta - usando apprenticeId y evaluationId
    @PrimaryColumn({ name: 'apprentice_id' })
    apprenticeId!: string;

    @PrimaryColumn({ name: "date", type: "date" })
    dateId!: Date;

    // Relación con ApprenticeEntity
    @ManyToOne(() => ApprenticeEntity, (apprentice: ApprenticeEntity) => apprentice.apprenticeEvaluations)
    @JoinColumn({ name: 'apprentice_id' })
    apprentice!: ApprenticeEntity;


  @Column({
    type: "enum",
    enum: EvaluationValue,
  })
  evaluation!: EvaluationValue;
}
