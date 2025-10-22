import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { GroupStatus } from "@domain/Enums";
import { AgencyEntity } from "./AgencyEntity";
import { AlbumEntity } from "./AlbumEntity";
import { GroupActivityEntity } from "./GroupActivity";
import { ArtistEntity } from "./ArtistEntity";
import { ArtistGroupMembershipEntity } from "./ArtistGroupMembershipEntity";
import { ArtistGroupCollaborationEntity } from "./ArtistGroupCollaborationEntity";

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
