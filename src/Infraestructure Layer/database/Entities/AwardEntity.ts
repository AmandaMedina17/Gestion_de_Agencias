import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class AwardEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'date' })
  date!: Date;
}