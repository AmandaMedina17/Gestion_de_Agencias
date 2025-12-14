import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { ActivityPlaceEntity } from './ActivityPlaceEntity';
import { AgencyEntity } from './AgencyEntity';
@Entity()
export class PlaceEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  place!: string;

  //Relación con las actividades
    @OneToMany(() => ActivityPlaceEntity, (activityPlace: ActivityPlaceEntity) => activityPlace.place)
    activityPlaces!: ActivityPlaceEntity[];

  // Relación con agencia
   @OneToMany(() => AgencyEntity, (agency) => agency.place)
  agencies!: AgencyEntity[];
}