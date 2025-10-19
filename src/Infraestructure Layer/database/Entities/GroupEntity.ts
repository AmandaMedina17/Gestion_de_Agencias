import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';
import { GroupStatus } from 'src/Domain Layer/Enums';
import { AgencyEntity } from './AgencyEntity';

@Entity('group')
export class GroupEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column({
    type: 'enum',
    enum: GroupStatus,
    default: GroupStatus.EN_PAUSA,
    })
    status!: GroupStatus;

  @Column()
  concept!: string;

  @Column({ type: 'date' })
  debutDate!: Date;

  @Column()
  memberNumber!: number;

  @Column()
  is_created!: boolean;

  @ManyToOne(() => AgencyEntity, agency => agency.groups) //Hacer simetrico en agencia
  agency!: AgencyEntity;
}