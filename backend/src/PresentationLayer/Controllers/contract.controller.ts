import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Delete, 
  Body, 
  Param, 
  ValidationPipe
} from '@nestjs/common';
import { ContractService } from '@application/services/contract.service';
import {UpdateContractDto } from '@application/DTOs/contractDto/update-contract.dto';
import { CreateContractDto } from '@application/DTOs/contractDto/create-contract.dto';

@Controller('contracts')
export class ContractController {
  constructor(
     private readonly contractService: ContractService) {}
  @Post()
  create(@Body(ValidationPipe) createContractDto: CreateContractDto){
    return this.contractService.create(createContractDto);
  }
  @Get()
  findAll() {
    return this.contractService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contractService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(ValidationPipe) updatecontractDto: UpdateContractDto) {
    return this.contractService.update(id, updatecontractDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contractService.remove(id);
  }
  @Get(':id/artists')
  getArtistContract(@Param('id') id: string){
    return this.contractService.getArtistContracts(id);
  }

}