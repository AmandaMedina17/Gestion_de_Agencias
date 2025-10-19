import { ChildEntity, Column } from 'typeorm';
import { ApprenticeEntity } from './ApprenticeEntity';
import { ArtistStatus } from 'src/Domain Layer/Enums';

@ChildEntity({ name: 'artist'})
    export class ArtistEntity extends ApprenticeEntity{
        @Column({ name: 'stage_name' })
        stageName!: string;

        @Column({
        type: 'enum',
        enum: ArtistStatus
        })
        statusArtist!: string;

        @Column({ name: 'birth_date' })
        birthDate!: Date;

        
        @Column({ name: 'transition_date' })
        transitionDate!: Date;

    }  

