import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { BillboardList } from '@domain/Entities/BillboardList';
import { CreateBillBoardListDto } from '@application/DTOs/billboardDto/create.billboard.dto';
import { ResponseBillboardListDto } from '@application/DTOs/billboardDto/response.billboard.dto';
import { UpdateBillboardListDto } from '@application/DTOs/billboardDto/update.billboard.dto';
import { IBillboardRepository } from '@domain/Repositories/IBillboardListRepository';
import { BillboardListDtoMapper } from '@application/DTOs/dtoMappers/billboardList.dto.mapper';

@Injectable()
export class BillboardListService extends BaseService<BillboardList,CreateBillBoardListDto,ResponseBillboardListDto,UpdateBillboardListDto>{
    constructor(
        @Inject(IBillboardRepository)
        private readonly billboardRepository: IBillboardRepository,
        private readonly billboardDtoMapper: BillboardListDtoMapper
    ) {
        super(billboardRepository, billboardDtoMapper)
    }
}
