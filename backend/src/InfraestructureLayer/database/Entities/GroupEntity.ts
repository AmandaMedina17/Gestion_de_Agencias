import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { GroupStatus } from "../../../DomainLayer/Enums";
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

  @Column()
  num_members!: number

  @Column({
    type: "enum",
    enum: GroupStatus,
    default: GroupStatus.EN_PAUSA,
  })
  status!: GroupStatus;

  @Column({ type: "date" })
  debutDate!: Date;

  @Column()
  is_created!: boolean;

  @Column()
  concept!: string;

  @Column()
  hasDebuted!: boolean;

  @Column({ name: "visualconcept", type: "varchar", nullable: true })
  visualconcept!: string | null;

  @Column({ name: "agency_id" })
  agencyId!: string; 

  @ManyToOne(() => AgencyEntity, (agency) => agency.groups, {
    nullable: false, // Un grupo debe pertenecer a una agencia
  })
  @JoinColumn({ name: "agency_id" }) 
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
  proposedByArtistId?: string | null = null;

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
