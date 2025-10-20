
import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, JoinColumn} from 'typeorm';
import { AgencyEntity } from './AgencyEntity';
import { AlbumEntity } from './AlbumEntity';
import { GroupActivityEntity } from './Many To Many/GroupActivity';
import { ArtistEntity } from './ArtistEntity';
import { ArtistGroupMembershipEntity } from './Many To Many/ArtistGroupMembershipEntity';
import { ArtistGroupCollaborationEntity } from './Many To Many/ArtistGroupCollaborationEntity'; 

export enum ApprenticeStatus {
  EN_ENTRENAMIENTO = "EN_ENTRENAMIENTO",
  PROCESO_DE_SELECCION = "PROCESO_DE_SELECCION",
  TRANSFERIDO = "TRANSFERIDO",
}

export enum ArtistRole {
  LIDER = "LIDER",
  VOCALISTA = "VOCALISTA",
  RAPERO = "RAPERO",
  BAILARIN = "BAILARIN",
  VISUAL = "VISUAL",
  MAKNAE = "MAKNAE",
}

export enum ArtistStatus {
  ACTIVO = "ACTIVO",
  EN_PAUSA = "EN_PAUSA",
  INACTIVO = "INACTIVO",
}

export enum Evaluation {
  EXCELENTE = "EXCELENTE",
  BIEN = "BIEN",
  REGULAR = "REGULAR",
  MAL = "MAL",
  INSUFICIENTE = "INSUFICIENTE",
}

export enum ApprenticeTrainingLevel {
  PRINCIPIANTE = "PRINCIPIANTE",
  INTERMEDIO = "INTERMEDIO",
  AVANZADO = "AVANZADO",
}

export enum ActivityType {
  INDIVIDUAL = "INDIVIDUAL",
  GRUPAL = "GRUPAL",
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
  PROMOTIONAL_EVENT = "PROMOTIONAL_EVENT",
}

export enum ContractStatus {
  ACTIVO = "ACTIVO",
  FINALIZADO = "FINALIZADO",
  EN_RENOVACION = "EN_RENOVACION",
  RESCINDIDO = "RESCINDIDO",
}

export enum GroupStatus {
  ACTIVO = "ACTIVO",
  EN_PAUSA = "EN_PAUSA",
  DISUELTO = "DISUELTO",
}

export enum BillboardListScope {
  INTERNACIONAL = "INTERNACIONAL",
  NACIONAL = "NACIONAL",
}

@Entity("group")
export class GroupEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column({
    type: "enum",
    enum: GroupStatus,
    default: GroupStatus.EN_PAUSA,
  })
  status!: GroupStatus;

  @Column()
  concept!: string;

  @Column({ type: "date" })
  debutDate!: Date;

  @Column()
  memberNumber!: number;

  @Column()
  is_created!: boolean;

  @ManyToOne(() => AgencyEntity, (agency) => agency.groups) //Hacer simetrico en agencia
  agency!: AgencyEntity;

  // Un grupo puede tener cero o muchos álbumes
  @OneToMany(() => AlbumEntity, (album: AlbumEntity) => album.group)
  albums!: AlbumEntity[];

  // Un grupo puede realizar cero o muchas actividades (a través de groupActivities)
  @OneToMany(
    () => GroupActivityEntity,
    (groupActivity: GroupActivityEntity) => groupActivity.group
  )
  groupActivities!: GroupActivityEntity[];

  //Un grupo puede ser propuesto por 0 o 1 artista
  @ManyToOne(
    () => ArtistEntity,
    (artist: ArtistEntity) => artist.proposedGroups,
    {
      nullable: true, // Permite que sea null (grupo no propuesto por artista)
      onDelete: "SET NULL", // Si se elimina el artista, el grupo se mantiene
    }
  )
  @JoinColumn({ name: "proposed_by_artist_id" })
  proposedByArtist?: ArtistEntity ;

  @Column({ name: "proposed_by_artist_id", nullable: true })
  proposedByArtistId!: string;

  // Relación con las membresías de artistas
  @OneToMany(
    () => ArtistGroupMembershipEntity,
    (membership: ArtistGroupMembershipEntity) => membership.group
  )
  artistMemberships!: ArtistGroupMembershipEntity[];

  //Colaboraciones con artistas
  @OneToMany(
    () => ArtistGroupCollaborationEntity,
    (collaboration: ArtistGroupCollaborationEntity) => collaboration.group
  )
  artistCollaborations!: ArtistGroupCollaborationEntity[];
}
