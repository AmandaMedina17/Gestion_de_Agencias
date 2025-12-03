import { Entity,PrimaryGeneratedColumn, Column , ManyToOne, JoinColumn, OneToMany, PrimaryColumn} from "typeorm";
import { SongBillboardEntity } from "./SongBillboardEntity";
import { BillboardListScope } from "@domain/Enums";

@Entity('billboardList')
export class BillboardListEntity{
    @PrimaryColumn()
    id!: string;

    @Column({ name: 'name' })
    name!: string;

    @Column({ name: 'entry_date' })
    entryDate!: Date;

    @Column({
        type : 'enum',
        enum : BillboardListScope
    })
    scope!: BillboardListScope;

    @Column({ name: 'end_list'})
    endList! : number;

    //Relación OneToMany con la entidad de unión
    @OneToMany(() => SongBillboardEntity, (songBillboard: SongBillboardEntity) => songBillboard.billboardList)
    songBillboards!: SongBillboardEntity[];

}