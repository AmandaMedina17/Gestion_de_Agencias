import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
//import { ActivityClassification, ActivityType } from "src/Domain Layer/Enums";
import { GroupActivityEntity } from "./Many To Many/GroupActivity";
import { ArtistActivityEntity } from "./Many To Many/ArtistActivityEntity";
import { ActivityDateEntity } from "./Many To Many/ActivityDateEntity";
import { ActivityResponsibleEntity } from "./Many To Many/ActivityResponsibleEntity";
import { ActivityPlaceEntity } from "./Many To Many/ActivityPlaceEntity";

export enum ApprenticeStatus{
    EN_ENTRENAMIENTO = "EN_ENTRENAMIENTO",
    PROCESO_DE_SELECCION = "PROCESO_DE_SELECCION",
    TRANSFERIDO = "TRANSFERIDO"
}

export enum ArtistRole{
    LIDER = "LIDER",
    VOCALISTA = "VOCALISTA", 
    RAPERO = "RAPERO",
    BAILARIN = "BAILARIN",
    VISUAL = "VISUAL",
    MAKNAE = "MAKNAE"
}

export enum ArtistStatus{
    ACTIVO = "ACTIVO",
    EN_PAUSA = "EN_PAUSA",
    INACTIVO = "INACTIVO"
}

export enum Evaluation{
    EXCELENTE = "EXCELENTE",
    BIEN = "BIEN",
    REGULAR = "REGULAR",
    MAL = "MAL",
    INSUFICIENTE = "INSUFICIENTE"
}

export enum ApprenticeTrainingLevel{
    PRINCIPIANTE = "PRINCIPIANTE",
    INTERMEDIO = "INTERMEDIO",
    AVANZADO = "AVANZADO"
}

export enum ActivityType{
    INDIVIDUAL = "INDIVIDUAL",
    GRUPAL = "GRUPAL"
}

export enum ActivityClassification {
    // Training
    VOCAL_CLASS = "VOCAL_CLASS",
    DANCE_CLASS = "DANCE_CLASS",
    RAP_CLASS = "RAP_CLASS",
    PHYSICAL_TRAINING = "PHYSICAL_TRAINING",
    // Performance
    SHOWCASE = "SHOWCASE",
    PRACTICE_CONCERT = "PRACTICE_CONCERT",
    VIDEO_RECORDING = "VIDEO_RECORDING",
    
    // Production
    AUDIO_RECORDING = "AUDIO_RECORDING",
    PHOTO_SHOOT = "PHOTO_SHOOT",
    CHOREOGRAPHY_REHEARSAL = "CHOREOGRAPHY_REHEARSAL",
    
    // Promotion
    INTERVIEW = "INTERVIEW",
    FAN_MEETING = "FAN_MEETING",
    PROMOTIONAL_EVENT = "PROMOTIONAL_EVENT"
}

export enum ContractStatus {
    ACTIVO = "ACTIVO",
    FINALIZADO = "FINALIZADO",
    EN_RENOVACION = "EN_RENOVACION",
    RESCINDIDO = "RESCINDIDO",
}

export enum GroupStatus{
    ACTIVO = "ACTIVO",
    EN_PAUSA= "EN_PAUSA",
    DISUELTO = "DISUELTO"
}
  
export enum BillboardListScope{
    INTERNACIONAL = "INTERNACIONAL",
    NACIONAL = "NACIONAL"
}

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
