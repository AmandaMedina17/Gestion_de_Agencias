import { Entity, ManyToOne, JoinColumn, Column, PrimaryColumn } from 'typeorm';
import { ArtistEntity } from '../ArtistEntity';
import { Activity } from '../ActivityEntity';

@Entity('artist_activity')
export class ArtistActivityEntity {
    // Llave primaria compuesta - usando artistId y activityId
    @PrimaryColumn({ name: 'artist_id' })
    artistId!: string;

    @PrimaryColumn({ name: 'activity_id' })
    activityId!: string;

    // Relación con ArtistEntity
    @ManyToOne(() => ArtistEntity, (artist: ArtistEntity) => artist.artistActivities)
    @JoinColumn({ name: 'artist_id' })
    artist!: ArtistEntity;

    // Relación con ActivityEntity
    @ManyToOne(() => Activity, (activity: Activity) => activity.artistActivities)
    @JoinColumn({ name: 'activity_id' })
    activity!: Activity;

    // Campo adicional para la confirmación
    @Column({ name: 'confirmation', type: 'boolean', default: true })
    confirmation!: boolean;
}