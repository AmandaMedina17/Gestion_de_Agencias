import { Apprentice } from "@domain/Entities/Apprentice";
import { BaseService } from "./base.service";
import { CreateApprenticeDto } from "@application/DTOs/apprenticeDto/create-apprentice.dto";
import { ApprenticeResponseDto } from "@application/DTOs/apprenticeDto/response-apprentice.dto";
import { UpdateApprenticeDto } from "@application/DTOs/apprenticeDto/update-apprentice.dto";
import { Inject, Injectable } from "@nestjs/common";
import { IApprenticeRepository } from "@domain/Repositories/IApprenticeRepository";
import { BaseDtoMapper } from "@application/DTOs/dtoMappers/DtoMapper";

@Injectable()
export class ApprenticeService extends BaseService<Apprentice, CreateApprenticeDto, ApprenticeResponseDto, UpdateApprenticeDto>{
    constructor(
        @Inject(IApprenticeRepository)
        private readonly apprenticeRepository: IApprenticeRepository,
        private readonly apprenticeDtoMapper: BaseDtoMapper<Apprentice, CreateApprenticeDto, ApprenticeResponseDto>
    ){
        super(apprenticeRepository, apprenticeDtoMapper)
    }
}