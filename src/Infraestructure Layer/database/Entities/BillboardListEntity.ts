import { Entity,PrimaryGeneratedColumn, Column , ManyToOne, JoinColumn, ManyToMany} from "typeorm";
import { SongEntity } from "./SongEntity";


@Entity('billboardList')
export class BillboardListEntity{
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'name' })
    name!: string;

    @Column({ name: 'entry_date' })
    entryDate!: Date;

    //relaciones
    @ManyToMany(() => SongEntity, song => song.billboardList)
    @JoinColumn({ name: 'song' })
    songs!: SongEntity;

}