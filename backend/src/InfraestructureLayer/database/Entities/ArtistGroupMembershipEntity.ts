import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { GroupEntity } from './GroupEntity';
import { ArtistEntity } from './ArtistEntity';

@Entity('artist_group_membership')
export class ArtistGroupMembershipEntity {
    // Llave primaria compuesta TRIPLE
    @PrimaryColumn({ name: 'group_id' })
    groupId!: string;

    @PrimaryColumn({ name: 'startDate', type: 'date' })
    startDate!: Date;

    @PrimaryColumn({ name: 'artist_id' })
    artistId!: string;

    // Relación con GroupEntity
    @ManyToOne(() => GroupEntity, (group: GroupEntity) => group.artistMemberships)
    @JoinColumn({ name: 'group_id' })
    group!: GroupEntity;

    // Relación con ArtistEntity
    @ManyToOne(() => ArtistEntity, (artist: ArtistEntity) => artist.groupMemberships)
    @JoinColumn({ name: 'artist_id' })
    artist!: ArtistEntity;

    // Campos adicionales
    @Column({ name: 'rol' })
    rol!: string;

    @Column({ name: 'fecha_debut_art', type: 'date' })
    fechaDebutArt!: Date;

    @Column({name: 'end_date',type: 'date'})
    endDate!: Date;
}