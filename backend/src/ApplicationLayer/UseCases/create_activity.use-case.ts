import { CreateActivityDto } from "@application/DTOs/activityDto/create-activity.dto";
import { Activity } from "@domain/Entities/Activity";
import { Place } from "@domain/Entities/Place";
import { Responsible } from "@domain/Entities/Responsible";
import { IActivityRepository } from "@domain/Repositories/IActivityRepository";
import { IPlaceRepository } from "@domain/Repositories/IPlaceRepository";
import { IResponsibleRepository } from "@domain/Repositories/IResponsibleRepository";
import { Injectable, Inject, NotFoundException } from "@nestjs/common";

@Injectable()
export class CreateActivityUseCase {
  constructor(
    @Inject(IActivityRepository)
    private activityRepository: IActivityRepository,
    @Inject(IResponsibleRepository) 
    private responsibleRepository: IResponsibleRepository,
    @Inject(IPlaceRepository)
    private placeRepository: IPlaceRepository
  ) {}

  async execute(activityDto: CreateActivityDto): Promise<Activity> {
    const [responsibles, places] = await Promise.all([
      this.getResponsibles(activityDto.responsibleIds),
      this.getPlaces(activityDto.placeIds),
    ]);

    // 2. Crear la actividad con las entidades relacionadas
    const activity = Activity.create(
      activityDto.classification,
      activityDto.type,
      responsibles,
      places,
      activityDto.dates
    );

    // 3. Guardar usando transacción
    const savedActivity = await this.activityRepository.save(activity);

    // 4. Devolver respuesta
    return activity
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