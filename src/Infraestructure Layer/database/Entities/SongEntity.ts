import { Entity,PrimaryGeneratedColumn, Column , ManyToOne, JoinColumn, OneToMany} from "typeorm";
import { AlbumEntity } from "./AlbumEntity";
import { SongBillboardEntity } from "./Many To Many/SongBillboardEntity";

@Entity('song')
export class SongEntity{
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'name' })
    name!: string;

    @Column({ name: 'entry_date' })
    entryDate!: Date;

    //relaciones
    @ManyToOne(() => AlbumEntity, album => album.songs)
    @JoinColumn({ name: 'album_id' })
    album!: AlbumEntity;

    @OneToMany(() => SongBillboardEntity, (songBillboard: SongBillboardEntity) => songBillboard.song)
    songBillboards!: SongBillboardEntity[];

}