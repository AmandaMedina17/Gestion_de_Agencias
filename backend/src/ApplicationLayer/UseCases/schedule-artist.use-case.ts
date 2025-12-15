import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { IArtistActivityRepository } from '@domain/Repositories/IArtistActivityRepository';
import { IArtistRepository } from '@domain/Repositories/IArtistRepository';
import { IActivityRepository } from '@domain/Repositories/IActivityRepository';
import { NotFoundException } from '@nestjs/common';
import { ScheduleArtistDto } from '@application/DTOs/schedule-artistDto/schedule-artist.dto';
import { ActivityType } from '@domain/Enums';

@Injectable()
export class ScheduleArtistUseCase {
  constructor(
    @Inject(IArtistActivityRepository)
    private readonly artistActivityRepository: IArtistActivityRepository,
    @Inject(IArtistRepository)
    private readonly artistRepository: IArtistRepository,
    @Inject(IActivityRepository)
    private readonly activityRepository: IActivityRepository,
  ) {}

  async execute(scheduleArtistDto: ScheduleArtistDto): Promise<void> {

    // Verificar que existen
    const artist = await this.artistRepository.findById(scheduleArtistDto.artistId)

    const activity = await this.activityRepository.findById(scheduleArtistDto.activityId)

    if (!artist) {
      throw new NotFoundException(`Artista con ID ${scheduleArtistDto.artistId} no encontrado`);
    }

    if (!activity) {
      throw new NotFoundException(`Actividad con ID ${scheduleArtistDto.activityId} no encontrada`);
    }

    // Verificar que la actividad sea de tipo Individual
    if(activity.getType() != ActivityType.INDIVIDUAL)
    {
      throw new Error( `No se puede programar una actividad grupal para un artista`);
    }

    // Verificar que no esté programada 
    const alreadyScheduled = await this.artistActivityRepository.isArtistScheduled(
      scheduleArtistDto.artistId,
      scheduleArtistDto.activityId
    );

    if (alreadyScheduled) {
      throw new ConflictException(
        'El artista ya está programado para esta actividad'
      );
    }

    // Verificar conflictos de horario
    const conflicts = await this.artistActivityRepository.checkScheduleConflicts(scheduleArtistDto.artistId, scheduleArtistDto.activityId)

    if (conflicts.length > 0) {
      throw new ConflictException( `El artista tiene conflictos de horario, no se pudo asignar la actividad` );
    }

    // Programar al artista
    await this.artistActivityRepository.scheduleArtist(
      scheduleArtistDto.artistId,
      scheduleArtistDto.activityId,
    );
  }
}
