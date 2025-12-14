import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { ArtistEntity } from './ArtistEntity';
import { DateEntity } from './DateEntity';

@Entity('artist_collaboration')
export class ArtistCollaborationEntity {
    // Llave primaria compuesta TRIPLE
    @PrimaryColumn({ name: 'artist1_id' })
    artist1Id!: string;

    @PrimaryColumn({ name: 'artist2_id' })
    artist2Id!: string;

    @PrimaryColumn({ name: 'date', type: 'date' })
    date!: Date;

    // Relación con el primer artista
    @ManyToOne(() => ArtistEntity, (artist: ArtistEntity) => artist.collaborationsAsArtist1)
    @JoinColumn({ name: 'artist1_id' })
    artist1!: ArtistEntity;

    // Relación con el segundo artista
    @ManyToOne(() => ArtistEntity, (artist: ArtistEntity) => artist.collaborationsAsArtist2)
    @JoinColumn({ name: 'artist2_id' })
    artist2!: ArtistEntity;

    // // Relación con la fecha
    // @ManyToOne(() => DateEntity, (date: DateEntity) => date.artistCollaborations)
    // @JoinColumn({ name: 'date_id' })
    // date!: DateEntity;
}