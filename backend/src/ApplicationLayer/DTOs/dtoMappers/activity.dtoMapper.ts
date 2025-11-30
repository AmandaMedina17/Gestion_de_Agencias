import { Activity } from "@domain/Entities/Activity";
import { BaseDtoMapper } from "./DtoMapper";
import { CreateActivityDto } from "../activityDto/create-activity.dto";
import { ActivityResponseDto } from "../activityDto/response-activity.dto";
import { ResponsibleDtoMapper } from "./responsible.dtoMapper";
import { PlaceDtoMapper } from "./place.dtoMapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ActivityDtoMapper extends BaseDtoMapper<Activity, CreateActivityDto, ActivityResponseDto>{

    constructor(
       private readonly responsibleDtoMapper: ResponsibleDtoMapper,
       private readonly placeDtoMapper: PlaceDtoMapper
    ){
    super()
    }
    
    fromDto(dto: CreateActivityDto): Activity {
        throw new Error('Activity creation requires complex logic. Use CreateActivityUseCase instead.');
    }

    toResponse(domain: Activity): ActivityResponseDto {
        
        if (!domain) {
            throw new Error('Activity is undefined in ActivityDtoMapper');
        }

        if (!this.responsibleDtoMapper) {
            throw new Error('ResponsibleDtoMapper is not injected');
        }

        if (!this.placeDtoMapper) {
            throw new Error('PlaceDtoMapper is not injected');
        }

        return{
            id: domain.getId(),
            classification: domain.getClassification(),
            type: domain.getType(),
            responsibles: this.responsibleDtoMapper.toResponseList(domain.getResponsibles()),
            places : this.placeDtoMapper.toResponseList(domain.getPlaces()),
            dates: domain.getDates()
        }
    }
}