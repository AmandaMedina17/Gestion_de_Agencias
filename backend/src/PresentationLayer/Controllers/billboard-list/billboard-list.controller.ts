import { CreateBillBoardListDto } from '@application/DTOs/billboardDto/create.billboard.dto';
import { UpdateBillboardListDto } from '@application/DTOs/billboardDto/update.billboard.dto';
import { BillboardListService } from '@application/services/billboard-list/billboard-list.service';
import { Body, Controller, Delete, Get, Param, Patch, Post, ValidationPipe } from '@nestjs/common';

@Controller('billboard')
export class BillboardListController {
  constructor(private readonly billboardListService: BillboardListService) {}

  @Post()
  create(@Body(ValidationPipe) createResponsibleDto: CreateBillBoardListDto) {
    return this.billboardListService.create(createResponsibleDto);
  }

  @Get()
  findAll() {
    return this.billboardListService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.billboardListService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(ValidationPipe) updateBillBoardListDto: UpdateBillboardListDto) {
    return this.billboardListService.update(id, updateBillBoardListDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.billboardListService.remove(id);
  }
}