import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { IntervalEntity } from "./IntervalEntity";
//import { ContractStatus } from "src/Domain Layer/Enums";
import { AgencyEntity } from "./AgencyEntity";
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
