import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResponsibleService } from '@application/services/ResponsibleService';
import { CreateResponsibleDto } from '@application/DTOs/ResponsibleDto/create-responsible.dto';
// import { UpdateResponsibleDto } from './ResponsibleDto/update-responsible.dto';

@Controller('responsible')
export class ResponsibleController {
  constructor(private readonly responsibleService: ResponsibleService) {}

  @Post()
  create(@Body() createResponsibleDto: CreateResponsibleDto) {
    return this.responsibleService.create(createResponsibleDto);
  }

  @Get()
  findAll() {
    return this.responsibleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.responsibleService.findById(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.responsibleService.delete(id);
  }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateResponsibleDto: UpdateResponsibleDto) {
//     return this.responsibleService.update(+id, updateResponsibleDto);
//   }

}