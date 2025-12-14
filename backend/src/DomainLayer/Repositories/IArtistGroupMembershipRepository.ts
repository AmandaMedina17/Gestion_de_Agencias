import { Group } from "@domain/Entities/Group";

export abstract class IArtistGroupMembershipRepository {
  // Terminar membresía
  abstract endMembership(artistId: string, groupId: string, endDate: Date): Promise<void>;

  // Crear nueva membresía 
  abstract createMembership(artistId: string, groupId: string, startDate: Date,
    rol: string, artistDebutDate: Date, endDate?: Date): Promise<void>;

  // Tomar grupo actual dado un artista
  abstract getArtistCurrentGroup(artistId: string): Promise<Group | null>

  // Obtener historial de membresías
  // getMembershipHistory(
  //   artistId: string, 
  //   groupId: string
  // ): Promise<ArtistGroupMembership[]>;  
}
