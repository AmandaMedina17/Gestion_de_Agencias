import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { ArtistGroupMembershipEntity } from './ArtistGroupMembershipEntity';
import { ArtistAgencyMembershipEntity } from './ArtistAgencyMembershipEntity';

@Entity()
export class IntervalEntity {
  @PrimaryColumn()
  id!: string;

  @Column({ type: 'date' })
  startDate!: Date;

  @Column({ type: 'date' })
  endDate!: Date;

  //Relación con las membresías de artistas
  // @OneToMany(() => ArtistGroupMembershipEntity, (membership: ArtistGroupMembershipEntity) => membership.interval)
  // artistGroupMemberships!: ArtistGroupMembershipEntity[];

  @OneToMany(() => ArtistAgencyMembershipEntity, (membership: ArtistAgencyMembershipEntity) => membership.interval)
  artistAgencyMemberships!: ArtistAgencyMembershipEntity[];
}