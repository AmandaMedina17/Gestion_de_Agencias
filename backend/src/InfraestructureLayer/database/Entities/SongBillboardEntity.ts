import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { SongEntity } from './SongEntity';
import { BillboardListEntity } from './BillboardListEntity';

@Entity('song_billboard')
export class SongBillboardEntity {
    //Llave primaria utiliando ambos ids
    @PrimaryColumn({ name: 'song_id' })
    songId!: string;

    @PrimaryColumn({ name: 'billboard_list_id' })
    billboardListId!: string;

    @Column({ name: 'place', type: 'int' })
    place!: number;

    @Column({name : 'entry_date'})
    entryDate! : Date;

    // Relación con SongEntity
    @ManyToOne(() => SongEntity, (song: SongEntity) => song.songBillboards, {onDelete : 'CASCADE'})
    @JoinColumn({ name: 'song_id' })
    song!: SongEntity;

    // Relación con BillboardListEntity
    @ManyToOne(() => BillboardListEntity, (billboardList: BillboardListEntity) => billboardList.songBillboards,
    {onDelete : 'CASCADE'})

    @JoinColumn({ name: 'billboard_list_id' })
    billboardList!: BillboardListEntity;
}