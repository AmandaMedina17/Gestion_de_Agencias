import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApprenticeEntity } from './ApprenticeEntity';

@Entity('agency')
export class AgencyEntity{
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'place' })
    place!: string;

    @Column({ name: 'date_fundation' })
    dateFundation!: Date;

    @Column({ name: 'name' })
    name!: string;

    @OneToMany(() => ApprenticeEntity, apprentice => apprentice.agency) //pueden ahber muchos aprendices en una agencia
    apprentices!: ApprenticeEntity[]; 

}

// private readonly id: AgencyID,
//     private place: Place,
//     private nameAgency: string,
//     private dateFundation: DateValue