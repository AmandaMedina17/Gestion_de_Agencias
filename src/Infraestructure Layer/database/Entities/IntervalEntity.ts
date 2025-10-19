import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ArtistGroupMembershipEntity } from './Many To Many/ArtistGroupMembershipEntity';

@Entity()
export class IntervalEntity {
  @PrimaryColumn()
  id!: string;

  @Column({ type: 'date' })
  startDate!: Date;

  @Column({ type: 'date' })
  endDate!: Date;

  //Relación con las membresías de artistas
  @OneToMany(() => ArtistGroupMembershipEntity, (membership: ArtistGroupMembershipEntity) => membership.interval)
  artistGroupMemberships!: ArtistGroupMembershipEntity[];
}