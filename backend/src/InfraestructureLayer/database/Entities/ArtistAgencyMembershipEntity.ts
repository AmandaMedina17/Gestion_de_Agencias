import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ArtistEntity } from './ArtistEntity';
import { AgencyEntity } from './AgencyEntity';
import { IntervalEntity } from './IntervalEntity';

@Entity('artist_agency_membership')
export class ArtistAgencyMembershipEntity {
    // Llave primaria compuesta TRIPLE
    @PrimaryColumn({ name: 'artist_id' })
    artistId!: string;

    @PrimaryColumn({ name: 'agency_id' })
    agencyId!: string;

    @PrimaryColumn({ name: 'interval_id' })
    intervalId!: string;

    // Relación con el artista
    @ManyToOne(() => ArtistEntity, (artist: ArtistEntity) => artist.agencyMemberships)
    @JoinColumn({ name: 'artist_id' })
    artist!: ArtistEntity;

    // Relación con la agencia
    @ManyToOne(() => AgencyEntity, (agency: AgencyEntity) => agency.artistMemberships)
    @JoinColumn({ name: 'agency_id' })
    agency!: AgencyEntity;

    // Relación con el intervalo
    @ManyToOne(() => IntervalEntity, (interval: IntervalEntity) => interval.artistAgencyMemberships)
    @JoinColumn({ name: 'interval_id' })
    interval!: IntervalEntity;
}