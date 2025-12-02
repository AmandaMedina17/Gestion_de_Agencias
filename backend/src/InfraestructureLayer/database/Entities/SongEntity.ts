import { Entity,PrimaryGeneratedColumn, Column , ManyToOne, JoinColumn, ManyToMany, OneToMany, PrimaryColumn} from "typeorm";
import { AlbumEntity } from "./AlbumEntity";
import { SongBillboardEntity } from "./SongBillboardEntity";

@Entity('song')
export class SongEntity{
    @PrimaryColumn()
    id!: string;

    @Column({ name: 'name' })
    name!: string;

    @Column({ name: 'entry_date' })
    entryDate!: Date;

    @ManyToOne(() => AlbumEntity, album => album.songs)
    @JoinColumn({ name: 'album_id' })
    album!: string;

    @OneToMany(() => SongBillboardEntity, (songBillboardNat: SongBillboardEntity) => songBillboardNat.song)
    songBillboardsNat!: SongBillboardEntity[];

    @OneToMany(() => SongBillboardEntity, (songBillboardsInt: SongBillboardEntity) => songBillboardsInt.song)
    songBillboardsInt!: SongBillboardEntity[];
}
