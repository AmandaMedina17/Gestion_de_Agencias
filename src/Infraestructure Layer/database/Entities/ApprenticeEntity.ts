import {
  Entity,
  PrimaryColumn,
  TableInheritance,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne
} from "typeorm";
import { AgencyEntity } from "./AgencyEntity";
// import {
//   ApprenticeStatus,
//   ApprenticeTrainingLevel,
// } from "src/Domain Layer/Enums";
import { ApprenticeEvaluationEntity } from "./Many To Many/ApprenticeEvaluationEntity";
import { ArtistEntity } from "./ArtistEntity";

export enum ApprenticeStatus{
    EN_ENTRENAMIENTO = "EN_ENTRENAMIENTO",
    PROCESO_DE_SELECCION = "PROCESO_DE_SELECCION",
    TRANSFERIDO = "TRANSFERIDO"
}

export enum ArtistRole{
    LIDER = "LIDER",
    VOCALISTA = "VOCALISTA", 
    RAPERO = "RAPERO",
    BAILARIN = "BAILARIN",
    VISUAL = "VISUAL",
    MAKNAE = "MAKNAE"
}

export enum ArtistStatus{
    ACTIVO = "ACTIVO",
    EN_PAUSA = "EN_PAUSA",
    INACTIVO = "INACTIVO"
}

export enum Evaluation{
    EXCELENTE = "EXCELENTE",
    BIEN = "BIEN",
    REGULAR = "REGULAR",
    MAL = "MAL",
    INSUFICIENTE = "INSUFICIENTE"
}

export enum ApprenticeTrainingLevel{
    PRINCIPIANTE = "PRINCIPIANTE",
    INTERMEDIO = "INTERMEDIO",
    AVANZADO = "AVANZADO"
}

export enum ActivityType{
    INDIVIDUAL = "INDIVIDUAL",
    GRUPAL = "GRUPAL"
}

export enum ActivityClassification {
    // Training
    VOCAL_CLASS = "VOCAL_CLASS",
    DANCE_CLASS = "DANCE_CLASS",
    RAP_CLASS = "RAP_CLASS",
    PHYSICAL_TRAINING = "PHYSICAL_TRAINING",
    // Performance
    SHOWCASE = "SHOWCASE",
    PRACTICE_CONCERT = "PRACTICE_CONCERT",
    VIDEO_RECORDING = "VIDEO_RECORDING",
    
    // Production
    AUDIO_RECORDING = "AUDIO_RECORDING",
    PHOTO_SHOOT = "PHOTO_SHOOT",
    CHOREOGRAPHY_REHEARSAL = "CHOREOGRAPHY_REHEARSAL",
    
    // Promotion
    INTERVIEW = "INTERVIEW",
    FAN_MEETING = "FAN_MEETING",
    PROMOTIONAL_EVENT = "PROMOTIONAL_EVENT"
}

export enum ContractStatus {
    ACTIVO = "ACTIVO",
    FINALIZADO = "FINALIZADO",
    EN_RENOVACION = "EN_RENOVACION",
    RESCINDIDO = "RESCINDIDO",
}

export enum GroupStatus{
    ACTIVO = "ACTIVO",
    EN_PAUSA= "EN_PAUSA",
    DISUELTO = "DISUELTO"
}
  
export enum BillboardListScope{
    INTERNACIONAL = "INTERNACIONAL",
    NACIONAL = "NACIONAL"
}

@Entity("apprentice")
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
  })
  status!: string;

  @Column({
    type: "enum",
    enum: ApprenticeTrainingLevel,
  })
  trainingLevel!: string;

  //Relaciones
  @ManyToOne(() => AgencyEntity, (agency) => agency.apprentices) //en una agencia pueden haber muchos aprendices
  @JoinColumn({ name: "agency_id" })
  agency!: AgencyEntity;

  @Column({ name: "agency_id" })
  agencyId!: string;


  @OneToOne(() => ArtistEntity, (artist) => artist.apprenticeId) //en una agencia pueden haber muchos aprendices
  @JoinColumn({ name: "apprentice_id" })
  artistId!: AgencyEntity;

  // @OneToMany(
  //   () => ApprenticeEvaluationEntity,
  //   (apprenticeEvaluation: ApprenticeEvaluationEntity) =>
  //     apprenticeEvaluation.apprentice
  // )
  // apprenticeEvaluations!: ApprenticeEvaluationEntity[];
}

