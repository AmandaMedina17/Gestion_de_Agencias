import { Entity,PrimaryGeneratedColumn, Column } from "typeorm";
//importar album


@Entity('song')
export class SongEntity{
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'name' })
    name!: string;

    @Column({ name: 'entry_date' })
    entryDate!: Date;

    //relaciones
    // @ManyToOne(() => AlbumEntity, album => album.apprentices) //en una agencia pueden haber muchos aprendices
    //     @JoinColumn({ name: 'agency_id' })
    //     agency!: AgencyEntity;
}