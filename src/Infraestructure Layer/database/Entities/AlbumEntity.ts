import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Album {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  releaseDate: Date;

  @Column()
  mainProducer: string;

  @Column()
  copiesSold: number;

  @Column()
  numberOfTracks: number;
}