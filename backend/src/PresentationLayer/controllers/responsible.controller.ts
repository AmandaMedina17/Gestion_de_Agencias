import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { ResponsibleService } from '@application/services/responsible.service';
import { CreateResponsibleDto } from '@application/DTOs/responsibleDto/create-responsible.dto';
import { UpdateResponsibleDto } from '@application/DTOs/responsibleDto/update-responsible.dto';

@Controller('responsible')
export class ResponsibleController {
  constructor(private readonly responsibleService: ResponsibleService) {}

  @Post()
  create(@Body(ValidationPipe) createResponsibleDto: CreateResponsibleDto) {
    return this.responsibleService.create(createResponsibleDto);
  }

  @Get()
  findAll() {
    return this.responsibleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.responsibleService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body(ValidationPipe) updateResponsibleDto: UpdateResponsibleDto) {
  //   return this.responsibleService.update(id, updateResponsibleDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.responsibleService.remove(id);
  }
}