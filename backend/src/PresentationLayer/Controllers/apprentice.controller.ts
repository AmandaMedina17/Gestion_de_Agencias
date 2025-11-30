import { Patch, Controller, Get, Post, Put, Delete, Body, Param, ValidationPipe } from '@nestjs/common';
import { ApprenticeService } from '@application/services/apprentice.service';
import { CreateApprenticeDto } from '@application/DTOs/apprenticeDto/create-apprentice.dto';
import { UpdateApprenticeDto } from '@application/DTOs/apprenticeDto/update-apprentice.dto';

@Controller('apprentices')
export class ApprenticeController {
  constructor(
    private readonly apprenticeService: ApprenticeService) {}

  @Post()
    create(@Body(ValidationPipe) createApprenticeDto: CreateApprenticeDto) {
      return this.apprenticeService.create(createApprenticeDto);
    }
  
    @Get()
    findAll() {
      return this.apprenticeService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.apprenticeService.findOne(id);
    }
  
    @Patch(':id')
    update(@Param('id') id: string, 
          @Body(ValidationPipe) updateapprenticeDto: UpdateApprenticeDto) {
      return this.apprenticeService.update(id, updateapprenticeDto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.apprenticeService.remove(id);
    }
}