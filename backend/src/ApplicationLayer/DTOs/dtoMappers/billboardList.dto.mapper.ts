import { BillboardList } from "@domain/Entities/BillboardList";
import { BaseDtoMapper } from "./DtoMapper";
import { CreateBillBoardListDto } from "../billboardDto/create.billboard.dto";
import { ResponseBillboardListDto } from "../billboardDto/response.billboard.dto";

export class BillboardListDtoMapper extends BaseDtoMapper<BillboardList, CreateBillBoardListDto, ResponseBillboardListDto>{

    fromDto(dto: CreateBillBoardListDto): BillboardList { 
      
      if(!dto.publicDate)
        throw new Error("Year of Billboard is missing");
  
      if(!dto.scope)
        throw new Error("Locality of Billboard is missing")

      if(!dto.nameList)
        throw new Error("Name of Billboard is missing")
    
      if(!dto.endList)
        throw new Error("Limit of songs es missing")
  
      return BillboardList.create(dto.publicDate,dto.scope,dto.nameList,dto.endList)
    };
  
    toResponse(domain: BillboardList): ResponseBillboardListDto {
      return {
          id: domain.getId(),
          publicDate: domain.getPublicDate(),
          scope : domain.getScope(),
          nameList : domain.getNameList(),
          endList: domain.getEndList()
      };
    }
   
  }


  //Para posteriores entregas implementar un singleton con para que los billboard son unicos por anno