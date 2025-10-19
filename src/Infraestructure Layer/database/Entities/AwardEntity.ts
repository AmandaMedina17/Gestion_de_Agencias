import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Award {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ type: 'date' })
  date: Date;
}