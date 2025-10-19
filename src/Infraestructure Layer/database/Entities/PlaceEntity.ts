import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ActivityPlaceEntity } from './ActivityPlaceEntity';
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