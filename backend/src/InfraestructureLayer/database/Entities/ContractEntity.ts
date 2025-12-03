import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ContractStatus } from "../../../DomainLayer/Enums";
import { AgencyEntity } from "./AgencyEntity";
import { ArtistEntity } from "./ArtistEntity";

@Entity()
export class ContractEntity {
  @PrimaryColumn({ name: 'contract_id' })
  contractID!: string;

  @PrimaryColumn()
  agencyID!: string;

  @PrimaryColumn()
  artistID!: string;

  @PrimaryColumn({ type: "date" })
  startDate!: Date;

  @PrimaryColumn({ type: "date" })
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
