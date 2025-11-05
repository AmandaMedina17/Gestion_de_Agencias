import {
  Entity,
  PrimaryColumn,
  TableInheritance,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany
} from "typeorm";
import { AgencyEntity } from "./AgencyEntity";
import { ApprenticeStatus, ApprenticeTrainingLevel } from "@domain/Enums";
import { ApprenticeEvaluationEntity } from "./ApprenticeEvaluationEntity";
import { ArtistEntity } from "./ArtistEntity";

@Entity("apprentice")
@TableInheritance({ column: { type: "varchar", name: "type" } })
export class ApprenticeEntity {
  @PrimaryColumn()
  id!: string;

  @Column({ name: "full_name" })
  fullName!: string;

  @Column({ name: "entry_date" })
  entryDate!: Date;

  @Column({ name: "age" })
  age!: number;

  @Column({
    type: "enum",
    enum: ApprenticeStatus,
    default: ApprenticeStatus.EN_ENTRENAMIENTO
  })
  status!: ApprenticeStatus;

  @Column({
    type: "enum",
    enum: ApprenticeTrainingLevel,
    default: ApprenticeTrainingLevel.PRINCIPIANTE
  })
  trainingLevel!: ApprenticeTrainingLevel;

  //Relaciones
  @ManyToOne(() => AgencyEntity, (agency) => agency.apprentices) //en una agencia pueden haber muchos aprendices
  @JoinColumn({ name: "agency_id" })
  agency!: AgencyEntity;

  @Column({ name: "agency_id" })
  agencyId!: string;


  @OneToOne(() => ArtistEntity, (artist) => artist.apprenticeId) //en una agencia pueden haber muchos aprendices
  @JoinColumn({ name: "apprentice_id" })
  artistId!: AgencyEntity;

  @OneToMany(
    () => ApprenticeEvaluationEntity,
    (apprenticeEvaluation: ApprenticeEvaluationEntity) =>
      apprenticeEvaluation.apprentice
  )
  apprenticeEvaluations!: ApprenticeEvaluationEntity[];
}

