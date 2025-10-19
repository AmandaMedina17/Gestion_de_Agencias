import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApprenticeEntity } from '../ApprenticeEntity';
import { EvaluationEntity } from '../EvaluationEntity';

@Entity('apprentice_evaluation')
export class ApprenticeEvaluationEntity {
    // Llave primaria compuesta - usando apprenticeId y evaluationId
    @PrimaryColumn({ name: 'apprentice_id' })
    apprenticeId!: string;

    @PrimaryColumn({ name: 'evaluation_id' })
    evaluationId!: string;

    // Relación con ApprenticeEntity
    @ManyToOne(() => ApprenticeEntity, (apprentice: ApprenticeEntity) => apprentice.apprenticeEvaluations, {
        primary: true
    })
    @JoinColumn({ name: 'apprentice_id' })
    apprentice!: ApprenticeEntity;

    // Relación con EvaluationEntity
    @ManyToOne(() => EvaluationEntity, (evaluation: EvaluationEntity) => evaluation.apprenticeEvaluations, {
        primary: true
    })
    @JoinColumn({ name: 'evaluation_id' })
    evaluation!: EvaluationEntity;
}