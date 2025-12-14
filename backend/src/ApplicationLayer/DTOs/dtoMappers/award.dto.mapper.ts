import { Injectable, NotImplementedException } from "@nestjs/common";
import { BaseDtoMapper } from "./DtoMapper";
import { Award } from "@domain/Entities/Award";
import { CreateAwardDto } from "../AwardDto/create.award.dto";
import { ResponseAwardDto } from "../AwardDto/response.award.dto";
import { AlbumDtoMapper } from "./album.dto.mapper";

@Injectable()
export class AwardDtoMapper extends BaseDtoMapper<Award, CreateAwardDto, ResponseAwardDto>{
    constructor(
      private readonly albumDtoMapper : AlbumDtoMapper
    ){
      super();
    }
    fromDto(dto: CreateAwardDto): Award { 
      throw new NotImplementedException("Award creation requires additional logic not handled in DTO mapping.");
    };
  
    toResponse(domain: Award): ResponseAwardDto {
        console.log(domain);
        return {
            id: domain.getId(),
            name: domain.getName(),
            date: domain.getDate(),
            album : domain.getAlbum() ? this.albumDtoMapper.toResponse(domain.getAlbum()!) : undefined
        };
    }
   
  }
