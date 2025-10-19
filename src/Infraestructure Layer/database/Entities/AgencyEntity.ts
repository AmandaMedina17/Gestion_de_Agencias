import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { ApprenticeEntity } from './ApprenticeEntity';
import { GroupEntity } from './GroupEntity';
import { group } from 'console';
import { ArtistAgencyMembershipEntity } from './Many To Many/ArtistAgencyMembershipEntity';

@Entity('agency')
export class AgencyEntity{
    @PrimaryColumn()
    id!: string;

    @Column({ name: 'place' })
    place!: string;

    @Column({ name: 'date_fundation' })
    dateFundation!: Date;

    @Column({ name: 'name' })
    name!: string;

    @OneToMany(() => ApprenticeEntity, apprentice => apprentice.agency) //pueden ahber muchos aprendices en una agencia
    apprentices!: ApprenticeEntity[]; 

    @OneToMany(() => GroupEntity, group => group.agency) 
    groups!: GroupEntity[]; 

    // Relación con membresías de artistas
    @OneToMany(() => ArtistAgencyMembershipEntity, (membership: ArtistAgencyMembershipEntity) => membership.agency)
    artistMemberships!: ArtistAgencyMembershipEntity[];
}

