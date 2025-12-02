import { Entity, PrimaryColumn, Column, JoinColumn, OneToOne } from 'typeorm';
import { ActivityEntity } from './ActivityEntity';
import { IncomeType } from '../../../DomainLayer/Enums';

@Entity('income')
export class IncomeEntity {
  @PrimaryColumn()
  id!: string;

  @PrimaryColumn({ name: 'activity_id' })
  activityID!: string;

  @Column({
    type: 'enum',
    enum: IncomeType,
    default: IncomeType.EFECTIVO
  })
  incomeType!: IncomeType;

  @Column({type: 'decimal', precision: 10, scale:2})
  mount!: number;  

  @Column({ type: 'date' })
  date!: Date;

  @Column()
  responsible!: string; 

  @OneToOne(() => ActivityEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'activity_id' }) 
  activity!: ActivityEntity;
}