// update_activity.use-case.ts
import { Activity } from "@domain/Entities/Activity";
import { Place } from "@domain/Entities/Place";
import { Responsible } from "@domain/Entities/Responsible";
import { IActivityRepository } from "@domain/Repositories/IActivityRepository";
import { IPlaceRepository } from "@domain/Repositories/IPlaceRepository";
import { IResponsibleRepository } from "@domain/Repositories/IResponsibleRepository";
import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { UpdateActivityDto } from "@application/DTOs/activityDto/update-activity.dto";

@Injectable()
export class UpdateActivityUseCase {
  constructor(
    @Inject(IActivityRepository)
    private activityRepository: IActivityRepository,
    @Inject(IResponsibleRepository) 
    private responsibleRepository: IResponsibleRepository,
    @Inject(IPlaceRepository)
    private placeRepository: IPlaceRepository
  ) {}

  async execute(activityId: string, updateDto: UpdateActivityDto): Promise<Activity> {
    // 1. Buscar la actividad existente
    const existingActivity = await this.activityRepository.findById(activityId);
    if (!existingActivity) {
      throw new NotFoundException(`Activity with id ${activityId} not found`);
    }

    // 2. Obtener responsables (si se proporcionan nuevos IDs)
    let responsibles = existingActivity.getResponsibles();
    if (updateDto.responsibleIds) {
      responsibles = await this.getResponsibles(updateDto.responsibleIds);
    }

    // 3. Obtener lugares (si se proporcionan nuevos IDs)
    let places = existingActivity.getPlaces();
    if (updateDto.placeIds) {
      places = await this.getPlaces(updateDto.placeIds);
    }

    // 4. Obtener fechas (si se proporcionan nuevas)
    let dates = existingActivity.getDates();
    if (updateDto.dates) {
      dates = updateDto.dates;
    }

    // 5. Crear objeto de actualización
    const updateData: any = {};
    
    if (updateDto.classification !== undefined) {
      updateData.classification = updateDto.classification;
    }
    
    if (updateDto.type !== undefined) {
      updateData.type = updateDto.type;
    }
    
    if (updateDto.responsibleIds !== undefined) {
      updateData.responsibles = responsibles;
    }
    
    if (updateDto.placeIds !== undefined) {
      updateData.places = places;
    }
    
    if (updateDto.dates !== undefined) {
      updateData.dates = dates;
    }

    // 6. Actualizar la actividad
    existingActivity.update(updateData);

    // 7. Guardar los cambios
    const updatedActivity = await this.activityRepository.update(existingActivity);

    return updatedActivity;
  }

  private async getResponsibles(ids: string[]): Promise<Responsible[]> {
    const responsibles = await Promise.all(
      ids.map(id => this.responsibleRepository.findById(id))
    );

    const missing = responsibles.filter(r => !r);
    if (missing.length > 0) {
      throw new NotFoundException('Algunos responsables no fueron encontrados');
    }

    return responsibles as Responsible[];
  }

  private async getPlaces(ids: string[]): Promise<Place[]> {
    const places = await Promise.all(
      ids.map(id => this.placeRepository.findById(id))
    );

    const missing = places.filter(p => !p);
    if (missing.length > 0) {
      throw new NotFoundException('Algunos lugares no fueron encontrados');
    }
    
    return places as Place[];
  }
}