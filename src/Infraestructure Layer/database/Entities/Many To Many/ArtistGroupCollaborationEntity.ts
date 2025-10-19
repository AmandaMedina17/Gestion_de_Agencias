import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { ArtistEntity } from '../ArtistEntity';
import { GroupEntity } from '../GroupEntity';
import { Date } from '../DateEntity';

@Entity('artist_group_collaboration')
export class ArtistGroupCollaborationEntity {
    // Llave primaria compuesta TRIPLE
    @PrimaryColumn({ name: 'artist_id' })
    artistId!: string;

    @PrimaryColumn({ name: 'group_id' })
    groupId!: string;

    @PrimaryColumn({ name: 'date_id' })
    dateId!: string;

    // Relación con el artista
    @ManyToOne(() => ArtistEntity, (artist: ArtistEntity) => artist.groupCollaborations, {
        primary: true
    })
    @JoinColumn({ name: 'artist_id' })
    artist!: ArtistEntity;

    // Relación con el grupo
    @ManyToOne(() => GroupEntity, (group: GroupEntity) => group.artistCollaborations, {
        primary: true
    })
    @JoinColumn({ name: 'group_id' })
    group!: GroupEntity;

    // Relación con la fecha
    @ManyToOne(() => Date, (date: Date) => date.artistGroupCollaborations, {
        primary: true
    })
    @JoinColumn({ name: 'date_id' })
    date!: Date;
}