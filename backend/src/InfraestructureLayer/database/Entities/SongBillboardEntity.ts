import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { SongEntity } from './SongEntity';
import { BillboardListEntity } from './BillboardListEntity';

@Entity('song_billboard')
export class SongBillboardEntity {
    // Llave primaria compuesta - usando songId y billboardListId
    @PrimaryColumn({ name: 'song_id' })
    songId!: string;

    @PrimaryColumn({ name: 'billboard_list_id' })
    billboardListId!: string;

    @Column({ name: 'puesto', type: 'int' })
    puesto!: number;

    // Relación con SongEntity
    @ManyToOne(() => SongEntity, (song: SongEntity) => song.songBillboardsNat)
    @JoinColumn({ name: 'song_id' })
    song!: SongEntity;

    // Relación con BillboardListEntity
    @ManyToOne(() => BillboardListEntity, (billboardList: BillboardListEntity) => billboardList.songBillboards)
    @JoinColumn({ name: 'billboard_list_id' })
    billboardList!: BillboardListEntity;
}