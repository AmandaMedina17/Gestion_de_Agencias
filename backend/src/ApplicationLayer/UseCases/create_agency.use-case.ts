import { CreateAgencyDto } from "@application/DTOs/agencyDto/create-agency.dto";
import { Agency } from "@domain/Entities/Agency";
import { IAgencyRepository } from "@domain/Repositories/IAgencyRepository";
import { IPlaceRepository } from "@domain/Repositories/IPlaceRepository";
import { Inject, Injectable } from "@nestjs/common";


@Injectable()
export class CreateAgencyUseCase {
  constructor(
    @Inject(IAgencyRepository)
    private readonly agencyRepository: IAgencyRepository,
    @Inject(IPlaceRepository)
    private readonly placeRepository: IPlaceRepository,
  ) {}

  async execute(createAgencyDto: CreateAgencyDto): Promise<Agency> {

    const {placeId, nameAgency, dateFundation} = createAgencyDto;

    // 1. Validar que el lugar exista
    const place = await this.placeRepository.findById(placeId);
    if (!place) {
      throw new Error('Place not found');
    }

    //Crear la agencia
    const agency = Agency.create(
      place,
      nameAgency, 
      dateFundation,
    );

    // Guardar la agencia
    return await this.agencyRepository.save(agency);
  }

}