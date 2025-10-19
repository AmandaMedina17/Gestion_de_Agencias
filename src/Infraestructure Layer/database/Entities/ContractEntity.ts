import { Entity, PrimaryColumn, Column } from 'typeorm';

export class Contrato {
  @ManyToOne(() => Interval, { primary: true })
  @JoinColumn({ name: "intervalID" })
  interval: Interval;

  @ManyToOne(() => Agency, { primary: true })
  @JoinColumn({ name: "agencyID" })
  agency: Agency;

  @ManyToOne(() => Artist, { primary: true })
  @JoinColumn({ name: "artistID" })
  artist: Artist;

  @Column({
    type: 'enum',
    enum: ContractStatus,
    default: ContractStatus.ACTIVO,
    })
    status: ContractStatus;

  @Column()
  conditions: string;

  @Column({ type: "decimal" })
  distributionPercentage: number

}