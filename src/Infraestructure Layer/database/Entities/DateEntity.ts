import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Date {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'date' })
  date: Date;
}