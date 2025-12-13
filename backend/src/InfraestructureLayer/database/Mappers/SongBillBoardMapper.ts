
import { SongBillboardEntity } from "../Entities/SongBillboardEntity";
import { Injectable } from "@nestjs/common";
import { SongMapper } from "./SongMapper";
import { BillboardListMapper } from "./BillboardListMapper";
import { SongBillboard } from "@domain/Entities/SongBillboard";
import { IMapper } from "./IMapper";

@Injectable()
export class SongBillBoardMapper extends IMapper<SongBillboard,SongBillboardEntity>{
  constructor(
      private readonly songMapper : SongMapper,
      private readonly billboardMapper :  BillboardListMapper,
  ){super()}

  toDomainEntity(dataBaseEntity: SongBillboardEntity): SongBillboard {
    //console.log(dataBaseEntity)
    

    return new SongBillboard(
      this.songMapper.toDomainEntity(dataBaseEntity.song), 
      this.billboardMapper.toDomainEntity(dataBaseEntity.billboardList),
      dataBaseEntity.place,
      dataBaseEntity.entryDate
    )
  }
  toDataBaseEntity(domainEntity: SongBillboard): SongBillboardEntity {
      const entity = new SongBillboardEntity();

      entity.songId = domainEntity.getSong().getId();
      entity.billboardListId = domainEntity.getBillboard().getId();
      entity.place = domainEntity.getPlace();
      entity.entryDate = domainEntity.getEntryDate();

      return entity;
  }
  
 
}