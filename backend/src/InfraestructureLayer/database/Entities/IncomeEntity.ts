import { Entity, PrimaryColumn, Column, JoinColumn, OneToOne } from 'typeorm';
import { ActivityEntity } from './ActivityEntity';
<<<<<<< Updated upstream
=======
import { IncomeType } from '../../../DomainLayer/Enums';
>>>>>>> Stashed changes

@Entity()
export class IncomeEntity {
  @PrimaryColumn()
  id!: string;

  @PrimaryColumn()
  activityID!: string;

  @Column({type: 'decimal', precision: 10, scale:2})
  mount!: number;  

  @Column({ type: 'date' })
  date!: Date;

  @Column()
  responsible!: string; 

  @OneToOne(() => ActivityEntity) //Revisar one to one
    @JoinColumn({ name: "activityID" })
    agency!: ActivityEntity;
}