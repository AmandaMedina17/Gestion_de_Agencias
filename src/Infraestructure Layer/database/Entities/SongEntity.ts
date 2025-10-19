import { Entity,PrimaryGeneratedColumn, Column , ManyToOne, JoinColumn, ManyToMany} from "typeorm";
import { AlbumEntity } from "./AlbumEntity";
import { BillboardListEntity } from "./BillboardListEntity";

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

    @ManyToMany(()=> BillboardListEntity, billboardList => billboardList.songs)
    @JoinColumn({ name: 'list_id' })
    billboardList!: AlbumEntity;
}