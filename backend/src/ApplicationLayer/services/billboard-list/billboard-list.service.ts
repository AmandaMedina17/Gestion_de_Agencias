import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { BillboardList } from '@domain/Entities/BillboardList';
import { CreateBillBoardListDto } from '@application/DTOs/billboardDto/create.billboard.dto';
import { ResponseBillboardListDto } from '@application/DTOs/billboardDto/response.billboard.dto';
import { UpdateBillboardListDto } from '@application/DTOs/billboardDto/update.billboard.dto';
import { BILLBOARD_LIST_REPOSITORY, IBillboardRepository } from '@domain/Repositories/IBillboardListRepository';
import { BaseDtoMapper } from '@application/DTOs/dtoMappers/DtoMapper';
import { BillboardListMapper } from '@infrastructure/database/Mappers/BillboardListMapper';

@Injectable()
export class BillboardListService extends BaseService<BillboardList,CreateBillBoardListDto,ResponseBillboardListDto,UpdateBillboardListDto>{
    constructor(
        @Inject(BILLBOARD_LIST_REPOSITORY)
        private readonly billboardRepository: IBillboardRepository,
        private readonly billboardDtoMapper: BaseDtoMapper<BillboardList, CreateBillBoardListDto, ResponseBillboardListDto>
    ) {
        super(billboardRepository, billboardDtoMapper)
    }
}
