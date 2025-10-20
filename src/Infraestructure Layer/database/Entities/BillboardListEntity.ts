import { Entity,PrimaryGeneratedColumn, Column , ManyToOne, JoinColumn, OneToMany} from "typeorm";
import { SongBillboardEntity } from "./Many To Many/SongBillboardEntity";

@Entity('billboardList')
export class BillboardListEntity{
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'name' })
    name!: string;

    @Column({ name: 'entry_date' })
    entryDate!: Date;

    //Relación OneToMany con la entidad de unión
    @OneToMany(() => SongBillboardEntity, (songBillboard: SongBillboardEntity) => songBillboard.billboardList)
    songBillboards!: SongBillboardEntity[];

}