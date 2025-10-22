import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { ArtistCollaborationEntity } from './ArtistCollaborationEntity';
import { ArtistGroupCollaborationEntity } from './ArtistGroupCollaborationEntity';
import { ActivityDateEntity } from './ActivityDateEntity';

@Entity()
export class Date {
  @PrimaryColumn()
  id!: string;

  @Column({ type: 'date' })
  date!: Date;

  //Relación con las colaboraciones de artistas
  @OneToMany(() => ArtistCollaborationEntity, (collaboration: ArtistCollaborationEntity) => collaboration.date)
  artistCollaborations!: ArtistCollaborationEntity[];

  // Relación con las colaboraciones artista-grupo
  @OneToMany(() => ArtistGroupCollaborationEntity, (collaboration: ArtistGroupCollaborationEntity) => collaboration.date)
  artistGroupCollaborations!: ArtistGroupCollaborationEntity[];

  // Relación con las actividades
  @OneToMany(() => ActivityDateEntity, (activityDate: ActivityDateEntity) => activityDate.date)
  activityDates!: ActivityDateEntity[];
}