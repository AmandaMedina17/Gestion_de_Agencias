import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { IntervalEntity } from "./IntervalEntity";
import { ContractStatus } from "../../../DomainLayer/Enums";
import { AgencyEntity } from "./AgencyEntity";
import { ArtistEntity } from "./ArtistEntity";

@Entity()
export class ContractEntity {
  @PrimaryColumn()
  intervalID!: string;

  @PrimaryColumn()
  agencyID!: string;

  @PrimaryColumn()
  artistID!: string;

  @Column({
    type: "enum",
    enum: ContractStatus,
    default: ContractStatus.ACTIVO,
  })
  status!: ContractStatus;

  @Column()
  conditions!: string;

  @Column({ type: "decimal" })
  distributionPercentage!: number;

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
