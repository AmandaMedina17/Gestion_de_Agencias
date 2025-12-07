import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { ArtistEntity } from './ArtistEntity';
import { AgencyEntity } from './AgencyEntity';

@Entity('artist_agency_membership')
export class ArtistAgencyMembershipEntity {
    // Llave primaria compuesta TRIPLE
    @PrimaryColumn({ name: 'artist_id' })
    artistId!: string;

    @PrimaryColumn({ name: 'agency_id' })
    agencyId!: string;

    @PrimaryColumn({ type: 'date' })
    startDate!: Date;

    @PrimaryColumn({ type: 'date' })
    endDate!: Date;

    // Relación con el artista
    @ManyToOne(() => ArtistEntity, (artist: ArtistEntity) => artist.agencyMemberships)
    @JoinColumn({ name: 'artist_id' })
    artist!: ArtistEntity;

    // Relación con la agencia
    @ManyToOne(() => AgencyEntity, (agency: AgencyEntity) => agency.artistMemberships)
    @JoinColumn({ name: 'agency_id' })
    agency!: AgencyEntity;

}