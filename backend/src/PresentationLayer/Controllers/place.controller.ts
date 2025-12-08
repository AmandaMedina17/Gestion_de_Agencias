import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { CreatePlaceDto } from '@application/DTOs/placeDto/create-place.dto';
import { PlaceService } from '@application/services/place.service';
import { UpdatePlaceDto } from '@application/DTOs/placeDto/update-place.dto';

@Controller('places')
export class PlaceController {

  constructor(private readonly placeService: PlaceService) {}

  @Post()
  create(@Body(ValidationPipe) createPlaceDto: CreatePlaceDto) {
    return this.placeService.create(createPlaceDto);
  }

  @Get()
  findAll() {
    return this.placeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.placeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(ValidationPipe) updateplaceDto: UpdatePlaceDto) {
    return this.placeService.update(id, updateplaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.placeService.remove(id);
  }
}