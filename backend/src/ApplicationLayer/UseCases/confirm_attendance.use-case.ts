// confirm-attendance.use-case.ts
import { ConfirmAttendanceDto } from "@application/DTOs/confirm_attendanceDto/create-confirm-attendance.dto";
import { IArtistActivityRepository } from "@domain/Repositories/IArtistActivityRepository";
import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { IArtistRepository } from "@domain/Repositories/IArtistRepository"; 
import { IGroupActivityRepository } from "@domain/Repositories/IGroupActivityRepository"; 

@Injectable()
export class ConfirmAttendanceUseCase {
  constructor(
    @Inject(IArtistActivityRepository)
    private readonly artistActivityRepository: IArtistActivityRepository,
    @Inject(IArtistRepository)
    private readonly artistRepository: IArtistRepository,
    @Inject(IGroupActivityRepository)
    private readonly groupActivityRepository: IGroupActivityRepository,
  ) {}

  async execute(confirmAttendanceDto: ConfirmAttendanceDto): Promise<void> {
    const { artistId, activityId, confirm } = confirmAttendanceDto;

    // Verificar si el artista está programado individualmente
    const isArtistScheduled = await this.artistActivityRepository.isArtistScheduled(artistId, activityId);
    
    if (isArtistScheduled) {
      // Si está programado individualmente, manejar confirmación individual
      if (confirm) {
        await this.artistActivityRepository.confirmAttendance(artistId, activityId);
      } 
      else {
        await this.artistActivityRepository.cancelAttendance(artistId, activityId);
      }
    }

    // Si no está programado individualmente, obtener su grupo actual
    const currentGroup = await this.artistRepository.getArtistCurrentGroup(artistId);
    
    if (!currentGroup) {
      throw new NotFoundException(
        `El artista ${artistId} no está programado individualmente para la actividad ${activityId} y no pertenece a ningún grupo actualmente`
      );
    }

    // Verificar si el grupo está programado para la actividad
    const isGroupScheduled = await this.groupActivityRepository.isGroupScheduled(
      currentGroup.getId(), 
      activityId
    );
    
    if (!isGroupScheduled) {
      throw new NotFoundException(
        `El artista ${artistId} no está programado individualmente ni su grupo (${currentGroup.getId()}) está programado para la actividad ${activityId}`
      );
    }

    // Manejar confirmación/cancelación a nivel grupal
    if (confirm) {
      await this.groupActivityRepository.confirmAttendance(currentGroup.getId(), activityId);
    } else {
      await this.groupActivityRepository.cancelAttendance(currentGroup.getId(), activityId);
    }
  }
}