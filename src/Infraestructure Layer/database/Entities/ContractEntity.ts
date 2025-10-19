import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn} from 'typeorm';
import { IntervalEntity } from './IntervalEntity';
import { ContractStatus } from 'src/Domain Layer/Enums';
import { AgencyEntity } from './AgencyEntity';
import { ArtistEntity } from './ArtistEntity';

@Entity()
export class ContractEntity {

  @PrimaryColumn()
  intervalID!: number;

  @PrimaryColumn()
  agencyID!: number;

  @PrimaryColumn()
  artistID!: number;
  
  @Column({
    type: 'enum',
    enum: ContractStatus,
    default: ContractStatus.ACTIVO,
    })
    status!: ContractStatus;

  @Column()
  conditions!: string;

  @Column({ type: "decimal" })
  distributionPercentage!: number

  //Relaciones
  @ManyToOne(() => IntervalEntity)
  @JoinColumn({ name: "intervalID" })
  interval!: IntervalEntity;

  @ManyToOne(() => AgencyEntity)
  @JoinColumn({ name: "agencyID" })
  agency!: AgencyEntity;

  @ManyToOne(() => ArtistEntity)
  @JoinColumn({ name: "artistID" })
  artist!: ArtistEntity;


}