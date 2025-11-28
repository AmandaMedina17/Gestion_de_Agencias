import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { ActivityClassification, ActivityType } from "../../../DomainLayer/Enums"
import { GroupActivityEntity } from "./GroupActivity"
import { ArtistActivityEntity } from "./ArtistActivityEntity";
import { ActivityDateEntity } from "./ActivityDateEntity";
import { ActivityResponsibleEntity } from "./ActivityResponsibleEntity";
import { ActivityPlaceEntity } from "./ActivityPlaceEntity";

@Entity()
export class ActivityEntity {
  @PrimaryColumn()
  id!: string;

  @Column({
    type: "enum",
    enum: ActivityClassification,
  })
  classification!: ActivityClassification;

  @Column({
    type: "enum",
    enum: ActivityType,
  })
  type!: ActivityType;

  // Una actividad puede ser realizada por cero o muchos grupos (a través de groupActivities)
  @OneToMany(
    () => GroupActivityEntity,
    (groupActivity: GroupActivityEntity) => groupActivity.activity
  )
  groupActivities!: GroupActivityEntity[];

  // Una actividad puede ser realizada por cero o muchos artistas
  @OneToMany(
    () => ArtistActivityEntity,
    (artistActivity: ArtistActivityEntity) => artistActivity.activity
  )
  artistActivities!: ArtistActivityEntity[];

  //Una actividad puede realizarse en cero o muchas fechas
  @OneToMany(
    () => ActivityDateEntity,
    (activityDate: ActivityDateEntity) => activityDate.activity
  )
  activityDates!: ActivityDateEntity[];

  // Una actividad puede tener cero o muchos responsables
  @OneToMany(
    () => ActivityResponsibleEntity,
    (activityResponsible: ActivityResponsibleEntity) =>
      activityResponsible.activity
  )
  activityResponsibles!: ActivityResponsibleEntity[];

  //Una actividad puede realizarse en cero o muchos lugares
  @OneToMany(
    () => ActivityPlaceEntity,
    (activityPlace: ActivityPlaceEntity) => activityPlace.activity
  )
  activityPlaces!: ActivityPlaceEntity[];
}
