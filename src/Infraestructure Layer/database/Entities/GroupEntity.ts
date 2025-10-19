import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Group {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: GroupStatus,
    default: GroupStatus.EN_PAUSA,
    })
    status: GroupStatus;

  @Column()
  concept: string;

  @Column({ type: 'date' })
  debutDate: Date;

  @Column()
  memberNumber: int;

  @Column()
  is_created: boolean;

  @ManyToOne()(() => Agency, agency => agency.groups) //Hacer simetrico en agencia
  agency: Agency;
}