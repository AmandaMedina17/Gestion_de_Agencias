import { 
  Entity, 
  PrimaryColumn, 
  Column, 
  OneToMany, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm';
import { ApprenticeEntity } from './ApprenticeEntity';
import { GroupEntity } from './GroupEntity';
import { ArtistAgencyMembershipEntity } from "./ArtistAgencyMembershipEntity";
import { PlaceEntity } from './PlaceEntity';

@Entity('agency')
export class AgencyEntity {
    @PrimaryColumn()
    id!: string;

    @Column({ name: 'date_fundation' })
    dateFundation!: Date;

    @Column({ name: 'name' })
    name!: string;
    
    @ManyToOne(() => PlaceEntity, { nullable: false })
    @JoinColumn({ name: 'place_id' })
    place!: PlaceEntity;

    @OneToMany(() => ApprenticeEntity, apprentice => apprentice.agency)
    apprentices!: ApprenticeEntity[];

    @OneToMany(() => GroupEntity, group => group.agency)
    groups!: GroupEntity[];

    @OneToMany(() => ArtistAgencyMembershipEntity, 
      (membership: ArtistAgencyMembershipEntity) => membership.agency)
    artistMemberships!: ArtistAgencyMembershipEntity[];
}
