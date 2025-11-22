import { Entity, Column, OneToMany , OneToOne, JoinColumn, PrimaryColumn} from "typeorm";
import { ApprenticeEntity } from "./ApprenticeEntity";
import { ArtistStatus } from "../../../DomainLayer/Enums";
import { ArtistActivityEntity } from "./ArtistActivityEntity";
import { AlbumEntity } from "./AlbumEntity";
import { GroupEntity } from "./GroupEntity";
import { ArtistGroupMembershipEntity } from "./ArtistGroupMembershipEntity";
import { ArtistCollaborationEntity } from "./ArtistCollaborationEntity";
import { ArtistGroupCollaborationEntity } from "./ArtistGroupCollaborationEntity";
import { ArtistAgencyMembershipEntity } from "./ArtistAgencyMembershipEntity";
import { ActivityDateEntity } from "./ActivityDateEntity";
import { ActivityResponsibleEntity } from "./ActivityResponsibleEntity";
import { ActivityPlaceEntity } from "./ActivityPlaceEntity";

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
  statusArtist!: ArtistStatus;

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
