import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ContractStatus } from "@domain/Enums";
import { AgencyEntity } from "./AgencyEntity";
import { ArtistEntity } from "./ArtistEntity";

@Entity()
export class ContractEntity {
  @PrimaryColumn()
  agencyID!: string;

  @PrimaryColumn()
  artistID!: string;

  @PrimaryColumn({ type: "timestamp" })
  startDate!: Date;

  @PrimaryColumn({ type: "timestamp" })
  endDate!: Date;

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
  @ManyToOne(() => AgencyEntity)
  @JoinColumn({ name: "agencyID" })
  agency!: AgencyEntity;

  @ManyToOne(() => ArtistEntity)
  @JoinColumn({ name: "artistID" })
  artist!: ArtistEntity;
}
