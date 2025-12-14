import { UpdateAgencyDto } from "@application/DTOs/agencyDto/update-agency.dto";
import { Agency } from "@domain/Entities/Agency";
import { IAgencyRepository } from "@domain/Repositories/IAgencyRepository";
import { IPlaceRepository } from "@domain/Repositories/IPlaceRepository";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";


@Injectable()
export class UpdateAgencyUseCase {
  constructor(
    @Inject(IAgencyRepository)
    private readonly agencyRepository: IAgencyRepository,
    @Inject(IPlaceRepository)
    private readonly placeRepository: IPlaceRepository,
  ) {}

  async execute(agencyId: string, updateAgencyDto: UpdateAgencyDto): Promise<Agency> {

    const existingAgency = await this.agencyRepository.findById(agencyId);
    
    if (!existingAgency) {
        throw new NotFoundException(`Entity with ID ${agencyId} not found`);
    }

    let place = existingAgency.getPlace();

    // Validar que el lugar exista
    if(updateAgencyDto.placeId)
    {
        const new_place = await this.placeRepository.findById(updateAgencyDto.placeId);
        if (!new_place) {
            throw new Error('Place not found');
        }

        place = new_place
    }

    const updateData: any = {};
    
    if (updateAgencyDto.placeId !== undefined) {
      updateData.place = place;
    }
    
    if (updateAgencyDto.nameAgency !== undefined) {
      updateData.nameAgency = updateAgencyDto.nameAgency;
    }
    
    if (updateAgencyDto.dateFundation !== undefined) {
      updateData.dateFundation = updateAgencyDto.dateFundation;
    }
    
    //Hacer validaciones de dominio
    existingAgency.update(updateData)

    await this.agencyRepository.update(existingAgency);

    const updatedEntity = await this.agencyRepository.findById(agencyId);
    if (!updatedEntity) {
        throw new NotFoundException(`Entity with ID ${agencyId} not found after update`);
    }

    return updatedEntity
  }
}