import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { ActivityResponsibleEntity } from './ActivityResponsibleEntity';

@Entity()
export class ResponsibleEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  //Relación con las actividades
  @OneToMany(() => ActivityResponsibleEntity, (activityResponsible: ActivityResponsibleEntity) => activityResponsible.responsible)
   activityResponsibles!: ActivityResponsibleEntity[];
}