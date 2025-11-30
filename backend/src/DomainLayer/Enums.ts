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

export enum EvaluationValue{
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
    CLASE_VOCAL = "CLASE_VOCAL",
    CLASE_BAILE = "CLASE_BAILE",
    CLASE_RAP = "CLASE_RAP",
    ENTRENAMIENTO_FÍSICO = "ENTRENAMIENTO_FÍSICO",
    // Actuación
    CONCIERTO_PRÁCTICA = "CONCIERTO_PRÁCTICA",
    GRABACIÓN_VÍDEO = "GRABACIÓN_VÍDEO",

    // Producción
    GRABACIÓN_AUDIO = "GRABACIÓN_AUDIO",
    SESIÓN_FOTOGRÁFICA = "SESIÓN_FOTOGRÁFICA",
    ENSAYO_COREOGRAFÍA = "ENSAYO_COREOGRAFÍA",

    // Promoción
    ENTREVISTA = "ENTREVISTA",
    REUNIÓN_FAN = "REUNIÓN_FAN",
    EVENTO_PROMOCIONAL = "EVENTO_PROMOCIONAL"
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

export enum UserRole {
  AGENCY_MANAGER = 'AGENCY_MANAGER',
  ARTIST = 'ARTIST',
  ADMIN = 'ADMIN',
}