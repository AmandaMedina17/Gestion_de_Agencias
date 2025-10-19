import { Entity, PrimaryColumn, Column } from 'typeorm';
import {Evaluation} from '';

@Entity()
export class Evaluation {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'date' })
  date: Date;

   @Column({
    type: 'enum',
    enum: Evaluation,
    default: Evaluation.BIEN,
    })
    evaluation: Evaluation;
}