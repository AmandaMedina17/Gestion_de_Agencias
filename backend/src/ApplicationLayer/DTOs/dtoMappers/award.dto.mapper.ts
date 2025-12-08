import { Injectable } from "@nestjs/common";
import { BaseDtoMapper } from "./DtoMapper";
import { Award } from "@domain/Entities/Award";
import { CreateAwardDto } from "../AwardDto/create.award.dto";
import { ResponseAwardDto } from "../AwardDto/response.award.dto";

@Injectable()
export class AwardDtoMapper extends BaseDtoMapper<Award, CreateAwardDto, ResponseAwardDto>{

    fromDto(dto: CreateAwardDto): Award { 
      
      if(!dto.date)
        throw new Error("Year of Award is missing");

      if(!dto.name)
        throw new Error("Name of Award is missing")
    
      return Award.create(dto.name,dto.date,dto.albumId!)
    };
  
    toResponse(domain: Award): ResponseAwardDto {
        return {
            id: domain.getId(),
            name: domain.getName(),
            date: domain.getDate(),
            albumId : domain.getAlbumId()
        };
    }
   
  }
