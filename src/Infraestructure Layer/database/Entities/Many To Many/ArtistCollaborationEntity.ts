import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { ArtistEntity } from '../ArtistEntity';
import { Date } from '../DateEntity';

@Entity('artist_collaboration')
export class ArtistCollaborationEntity {
    // Llave primaria compuesta TRIPLE
    @PrimaryColumn({ name: 'artist1_id' })
    artist1Id!: string;

    @PrimaryColumn({ name: 'artist2_id' })
    artist2Id!: string;

    @PrimaryColumn({ name: 'date_id' })
    dateId!: string;

    // Relación con el primer artista
    @ManyToOne(() => ArtistEntity, (artist: ArtistEntity) => artist.collaborationsAsArtist1, {
        primary: true
    })
    @JoinColumn({ name: 'artist1_id' })
    artist1!: ArtistEntity;

    // Relación con el segundo artista
    @ManyToOne(() => ArtistEntity, (artist: ArtistEntity) => artist.collaborationsAsArtist2, {
        primary: true
    })
    @JoinColumn({ name: 'artist2_id' })
    artist2!: ArtistEntity;

    // Relación con la fecha
    @ManyToOne(() => Date, (date: Date) => date.artistCollaborations, {
        primary: true
    })
    @JoinColumn({ name: 'date_id' })
    date!: Date;
}