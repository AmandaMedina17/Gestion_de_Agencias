import { Entity, Column, OneToMany , OneToOne, JoinColumn, PrimaryColumn} from "typeorm";
import { ApprenticeEntity } from "./ApprenticeEntity";
//import { ArtistStatus } from "src/Domain Layer/Enums";
import { ArtistActivityEntity } from "./Many To Many/ArtistActivityEntity";
import { AlbumEntity } from "./AlbumEntity";
import { GroupEntity } from "./GroupEntity";
import { ArtistGroupMembershipEntity } from "./Many To Many/ArtistGroupMembershipEntity";
import { ArtistCollaborationEntity } from "./Many To Many/ArtistCollaborationEntity";
import { ArtistGroupCollaborationEntity } from "./Many To Many/ArtistGroupCollaborationEntity";
import { ArtistAgencyMembershipEntity } from "./Many To Many/ArtistAgencyMembershipEntity";
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

@Entity({ name: "artist" })
export class ArtistEntity{
  @PrimaryColumn()
  id!: string;

  @Column({ name: "stage_name" })
  stageName!: string;

  @Column({
    type: "enum",
    enum: ArtistStatus,
  })
  statusArtist!: string;

  @Column({ name: "birth_date" })
  birthDate!: Date;

  @Column({ name: "transition_date" })
  transitionDate!: Date;

  // Un artista puede realizar cero o muchas actividades
  @OneToMany(
    () => ArtistActivityEntity,
    (artistActivity: ArtistActivityEntity) => artistActivity.artist
  )
  artistActivities!: ArtistActivityEntity[];

  //Un artista puede tener cero o muchos álbumes
  @OneToMany(() => AlbumEntity, (album: AlbumEntity) => album.artist)
  albums!: AlbumEntity[];

 // Un artista puede proponer cero o muchos grupos
  @OneToMany(() => GroupEntity, (group: GroupEntity) => group.proposedByArtist)
  proposedGroups!: GroupEntity[];

  //Relación con las membresías en grupos
  @OneToMany(
    () => ArtistGroupMembershipEntity,
    (membership: ArtistGroupMembershipEntity) => membership.artist
  )
  groupMemberships!: ArtistGroupMembershipEntity[];

  //Colaboraciones donde el artista es el primero (artist1)
  @OneToMany(
    () => ArtistCollaborationEntity,
    (collaboration: ArtistCollaborationEntity) => collaboration.artist1
  )
  collaborationsAsArtist1!: ArtistCollaborationEntity[];

  //Colaboraciones donde el artista es el segundo (artist2)
  @OneToMany(
    () => ArtistCollaborationEntity,
    (collaboration: ArtistCollaborationEntity) => collaboration.artist2
  )
  collaborationsAsArtist2!: ArtistCollaborationEntity[];

  //Colaboraciones con grupos
  @OneToMany(
    () => ArtistGroupCollaborationEntity,
    (collaboration: ArtistGroupCollaborationEntity) => collaboration.artist
  )
  groupCollaborations!: ArtistGroupCollaborationEntity[];

  // Membresías en agencias
  @OneToMany(
    () => ArtistAgencyMembershipEntity,
    (membership: ArtistAgencyMembershipEntity) => membership.artist
  )
  agencyMemberships!: ArtistAgencyMembershipEntity[];

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

  // Una actividad puede realizarse en cero o muchos lugares
  @OneToMany(
    () => ActivityPlaceEntity,
    (activityPlace: ActivityPlaceEntity) => activityPlace.activity
  )
  activityPlaces!: ActivityPlaceEntity[];

  @OneToOne(() => ApprenticeEntity, (artist) => artist.artistId) //en una agencia pueden haber muchos aprendices
    @JoinColumn({ name: "apprentice_id" })
    apprenticeId!: ApprenticeEntity;
}
