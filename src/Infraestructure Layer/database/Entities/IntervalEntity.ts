import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class IntervalEntity {
  @PrimaryColumn()
  id!: string;

  @Column({ type: 'date' })
  startDate!: Date;

  @Column({ type: 'date' })
  endDate!: Date;
}