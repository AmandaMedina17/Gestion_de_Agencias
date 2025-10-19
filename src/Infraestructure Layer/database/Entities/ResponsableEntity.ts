import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Responsable {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;
}