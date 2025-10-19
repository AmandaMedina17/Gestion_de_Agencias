import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ArtistCollaborationEntity } from './Many To Many/ArtistCollaborationEntity.ts';
import { ArtistGroupCollaborationEntity } from './Many To Many/ArtistGroupCollaborationEntity';
import { ActivityDateEntity } from './Many To Many/ActivityDateEntity';

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