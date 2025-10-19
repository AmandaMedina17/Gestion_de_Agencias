import { Entity, PrimaryGeneratedColumn, TableInheritance, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AgencyEntity } from './AgencyEntity';

@Entity('apprentice')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class ApprenticeEntity{
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'full_name' })
    fullName!: string;

    @Column({ name: 'entry_date' })
    entryDate!: Date;

    @Column({ name: 'age' })
    age!: number;

    @Column({
    type: 'enum',
    enum: ['EN_ENTRENAMIENTO', 'PROCESO_DE_SELECCION', 'TRANSFERIDO'],
    default: 'EN_ENTRENAMIENTO'
    })
    status!: string;

    @Column({
    type: 'enum',
    enum: ['PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO'],
    default: 'PRINCIPIANTE'
    })
    trainingLevel!: string;

    //Relaciones
    @ManyToOne(() => AgencyEntity, agency => agency.apprentices) //en una agencia pueden haber muchos aprendices
    @JoinColumn({ name: 'agency_id' })
    agency!: AgencyEntity;

    @Column({ name: 'agency_id' })
    agencyId!: string;

}

// private fullName: string,
//     private age: number,
//     private entryDate: DateValue,
//     private trainingLevel: ApprenticeTrainingLevel,
//     private status: ApprenticeStatus,
//     private agency: AgencyID