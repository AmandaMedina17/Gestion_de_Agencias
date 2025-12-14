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
import { AgencyService } from '@application/services/agency.service';
import {UpdateAgencyDto } from '@application/DTOs/agencyDto/update-agency.dto';
import { CreateAgencyDto } from '@application/DTOs/agencyDto/create-agency.dto';
import { CreateArtistAgencyDto } from '@application/DTOs/artist_agencyDto/create-artist-agency.dto';
import { CreateEndMembershipDto } from '@application/DTOs/endArtistMembership/create-end-artist-membership.dto';

@Controller('agencies')
export class AgencyController {
  constructor(private readonly agencyService: AgencyService) {}

  @Post()
  create(@Body(ValidationPipe) createAgencyDto: CreateAgencyDto){
    return this.agencyService.create(createAgencyDto);
  }

  @Get()
    findAll() {
    return this.agencyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agencyService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(ValidationPipe) updateagencyDto: UpdateAgencyDto) {
    return this.agencyService.update(id, updateagencyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.agencyService.remove(id);
  }

  @Patch('end-membership')
  endMembership(@Body(ValidationPipe) createEndMembershipDto: CreateEndMembershipDto){
    return this.agencyService.removeArtistFromAgency(createEndMembershipDto);
  }

  
  @Get(':id/artists')
  getAgencyArtists(@Param('id') id: string) {
    return this.agencyService.getAgencyArtists(id);
  }

  @Get(':id/apprentices')
  getAgencyApprentices(@Param('id') id: string) {
    return this.agencyService.getAgencyApprentices(id);
  }

  @Post(':agencyId/artists')
  addArtistToAgency(
    @Param('agencyId') agencyId: string,
    @Body(ValidationPipe) createArtistAgencyDto: CreateArtistAgencyDto
  ) {
    return this.agencyService.relateArtistToAgency(agencyId,createArtistAgencyDto);
  }

  @Get(':id/groups')
  getAgencyGroups(@Param('id') id: string) {
    return this.agencyService.getAgencyGroups(id);
  }

  @Get(':id/activeArtists')
  getActiveArtistsWithGroup(@Param('id') id: string){
    return this.agencyService.getAgencyActiveArtistAndGruopInfo(id);
  }

  @Get(':id/artists-with-debut-and-contracts')
  getArtistsWithDebutAndContracts(@Param('id') id: string) {
    return this.agencyService.getArtistsWithDebutAndActiveContracts(id);
  }

  @Get(':id/collaborations')
    getAgencyCollaborations(@Param('id') id: string) {
    return this.agencyService.getAgencyCollaborations(id);
  }

}