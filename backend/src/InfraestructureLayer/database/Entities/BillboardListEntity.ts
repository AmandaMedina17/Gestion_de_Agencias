import { Entity,PrimaryGeneratedColumn, Column , ManyToOne, JoinColumn, OneToMany} from "typeorm";
import { SongBillboardEntity } from "./SongBillboardEntity";
import { BillboardListScope } from "@domain/Enums";

@Entity('billboardList')
export class BillboardListEntity{
    @PrimaryGeneratedColumn()
    id!: string;

    @Column({ name: 'name' })
    name!: string;

    @Column({ name: 'entry_date' })
    entryDate!: Date;

    @Column({
        type : 'enum',
        enum : BillboardListScope
    })

    //Relación OneToMany con la entidad de unión
    @OneToMany(() => SongBillboardEntity, (songBillboard: SongBillboardEntity) => songBillboard.billboardList)
    songBillboards!: SongBillboardEntity[];

}