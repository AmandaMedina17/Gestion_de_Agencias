import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Place {
  @PrimaryColumn()
  id: string;

  @Column()
  place: string;
}