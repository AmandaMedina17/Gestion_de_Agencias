import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { ActivityPlaceEntity } from './Many To Many/ActivityPlaceEntity';
@Entity()
export class PlaceEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  place!: string;

  //Relación con las actividades
    @OneToMany(() => ActivityPlaceEntity, (activityPlace: ActivityPlaceEntity) => activityPlace.place)
    activityPlaces!: ActivityPlaceEntity[];
}