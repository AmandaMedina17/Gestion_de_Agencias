import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class PlaceEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  place!: string;
}