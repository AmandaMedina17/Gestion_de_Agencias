import { ChildEntity, Column } from 'typeorm';
import { ApprenticeEntity } from './ApprenticeEntity';

@ChildEntity({ name: 'artist'})
    export class ArtistEntity extends ApprenticeEntity{
        @Column({ name: 'stage_name' })
        stageName!: string;

        // @Column({
        // type: 'enum',
        // enum: ['LIDER', 'VOCALISTA', 'RAPERO', 'BAILARIN', 'VISUAL', 'MAKNAE'],
        // default: 'VISUAL'
        // })
        // role!: string;

        @Column({
        type: 'enum',
        enum: ['ACTIVO', 'INACTIVO', 'EN_PAUSA'],
        default: 'ACTIVO'
        })
        statusArtist!: string;

        @Column({ name: 'birth_date' })
        birthDate!: Date;

        
        @Column({ name: 'transition_date' })
        transitionDate!: Date;

    }  

