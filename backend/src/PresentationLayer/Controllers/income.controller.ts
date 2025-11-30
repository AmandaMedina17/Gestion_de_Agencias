import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { IncomeService } from '@application/services/income.service';
import { CreateIncomeDto } from '@application/DTOs/incomeDto/create-income.dto';
import { UpdateIncomeDto } from '@application/DTOs/incomeDto/update-income.dto';

@Controller('income')
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Post()
  create(@Body(ValidationPipe) createIncomeDto: CreateIncomeDto) {
    return this.incomeService.create(createIncomeDto);
  }

  @Get()
  findAll() {
    return this.incomeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.incomeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIncomeDto: UpdateIncomeDto) {
    return this.incomeService.update(id, updateIncomeDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.incomeService.remove(id);
  // }
}
