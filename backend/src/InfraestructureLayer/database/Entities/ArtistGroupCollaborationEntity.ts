import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { ArtistEntity } from './ArtistEntity';
import { GroupEntity } from './GroupEntity';
import { DateEntity } from './DateEntity';

@Entity('artist_group_collaboration')
export class ArtistGroupCollaborationEntity {
    // Llave primaria compuesta TRIPLE
    @PrimaryColumn({ name: 'artist_id' })
    artistId!: string;

    @PrimaryColumn({ name: 'group_id' })
    groupId!: string;

    @PrimaryColumn({ name: 'date' , type: 'date'})
    date!: Date;

    // Relación con el artista
    @ManyToOne(() => ArtistEntity, (artist: ArtistEntity) => artist.groupCollaborations)
    @JoinColumn({ name: 'artist_id' })
    artist!: ArtistEntity;

    // Relación con el grupo
    @ManyToOne(() => GroupEntity, (group: GroupEntity) => group.artistCollaborations)
    @JoinColumn({ name: 'group_id' })
    group!: GroupEntity;

    // // Relación con la fecha
    // @ManyToOne(() => DateEntity, (date: DateEntity) => date.artistGroupCollaborations)
    // @JoinColumn({ name: 'date_id' })
    // date!: DateEntity;
}