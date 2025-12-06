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

    @Column({name : 'album_id'})
    albumId!:  string;

    @ManyToOne(() => AlbumEntity, album => album.songs,{
        onDelete : 'CASCADE',
        onUpdate : 'CASCADE'
    })
    @JoinColumn({ name: 'album_id' })
    album!: AlbumEntity;

    @OneToMany(() => SongBillboardEntity, (songBillboards: SongBillboardEntity) => songBillboards.song)
    songBillboards!: SongBillboardEntity[];

}
