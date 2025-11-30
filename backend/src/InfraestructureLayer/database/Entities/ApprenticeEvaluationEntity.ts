import { Entity, Column,PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApprenticeEntity } from './ApprenticeEntity';
import { EvaluationValue} from '@domain/Enums';

@Entity('apprentice_evaluation')
export class ApprenticeEvaluationEntity {
    @PrimaryColumn({ name: 'apprentice_id' })
    apprenticeId!: string;

    @PrimaryColumn({ name: "date", type: "date" })
    dateId!: Date;

    // Relación con ApprenticeEntity
    @ManyToOne(() => ApprenticeEntity, (apprentice: ApprenticeEntity) => apprentice.evaluations)
    @JoinColumn({ name: 'apprentice_id' })
    apprentice!: ApprenticeEntity;


  @Column({
    type: "enum",
    enum: EvaluationValue,
  })
  evaluation!: EvaluationValue;
}
