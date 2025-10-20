import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { GroupEntity } from '../GroupEntity';
import { IntervalEntity } from '../IntervalEntity';
import { ArtistEntity } from '../ArtistEntity';

@Entity('artist_group_membership')
export class ArtistGroupMembershipEntity {
    // Llave primaria compuesta TRIPLE
    @PrimaryColumn({ name: 'group_id' })
    groupId!: string;

    @PrimaryColumn({ name: 'interval_id' })
    intervalId!: string;

    @PrimaryColumn({ name: 'artist_id' })
    artistId!: string;

    // Relación con GroupEntity
    @ManyToOne(() => GroupEntity, (group: GroupEntity) => group.artistMemberships)
    @JoinColumn({ name: 'group_id' })
    group!: GroupEntity;

    // Relación con IntervalEntity
    @ManyToOne(() => IntervalEntity, (interval: IntervalEntity) => interval.artistGroupMemberships)
    @JoinColumn({ name: 'interval_id' })
    interval!: IntervalEntity;

    // Relación con ArtistEntity
    @ManyToOne(() => ArtistEntity, (artist: ArtistEntity) => artist.groupMemberships)
    @JoinColumn({ name: 'artist_id' })
    artist!: ArtistEntity;

    // Campos adicionales
    @Column({ name: 'rol' })
    rol!: string;

    @Column({ name: 'fecha_debut_art', type: 'date' })
    fechaDebutArt!: Date;
}