import { ValidationPipe, Controller, Get, Post, Put, Delete, Body, Param, Query, Inject, Patch } from '@nestjs/common';
import { ArtistService } from '@application/services/artist.service';
import { UpdateApprenticeDto } from '@application/DTOs/apprenticeDto/update-apprentice.dto';
import { CreateArtistDto } from '@application/DTOs/artistDto/create-artist.dto';
import { UpdateArtistDto } from '@application/DTOs/artistDto/update-artist.dto';
import { CreateArtistCollaborationDto } from '@application/DTOs/artistCollaborationsDto/create-artist-collaboration.dto';
import { CreateArtistGroupCollaborationDto } from '@application/DTOs/artist_groupCollaborationDto/create-artist-group-collaboration.dto';
import { ProfessionalHistoryResponseDto } from '@application/DTOs/professional_historyDto/response-professional-history.dto';
import { GroupResponseDto } from '@application/DTOs/groupDto/response-group.dto';

@Controller('artists')
export class ArtistController {
  constructor(
    private readonly artistService: ArtistService
  ) {}

  @Post()
  create(@Body(ValidationPipe) createArtistDto: CreateArtistDto) {
  return this.artistService.create(createArtistDto);
  }

  @Post('artist-to-artist')
  createArtistCollaboration(
    @Body(ValidationPipe) createArtistCollaborationDto: CreateArtistCollaborationDto
  ) {
    return this.artistService.createArtistCollaboration(createArtistCollaborationDto);
  }

  @Post('artist-to-group')
  createArtistGroupCollaboration(
    @Body(ValidationPipe) createArtistGroupCollaborationDto: CreateArtistGroupCollaborationDto
  ) {
    return this.artistService.createArtistGroupCollaboration(createArtistGroupCollaborationDto);
  }

  @Get()
  findAll() {
    return this.artistService.findAll();
  }
  
  @Get('agency-changes-and-groups/:agencyId')
  getArtistsWithAgencyChangesAndGroups(@Param('agencyId') agencyId: string){
    return this.artistService.getArtistsWithAgencyChangesAndGroups(agencyId);
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artistService.findOne(id);
  }

  @Get(':id/artist-collaborations')
  getArtistCollaborations(@Param('id') id: string) {
    return this.artistService.getArtist_ArtistCollaborations(id);
  }

  @Get(':id/professional-history')
  getProfessionalHistory(@Param('id') id: string): Promise<ProfessionalHistoryResponseDto> {
    return this.artistService.getProfessionalHistory(id);
  }

  @Get(':id/groups')
  getGroups(@Param('id') id: string): Promise<GroupResponseDto[]>{
    return this.artistService.getArtistGroups(id);
  }

  @Get(':id/group-collaborations')
  getGroupCollaborations(@Param('id') id: string) {
    return this.artistService.getArtist_GroupCollaborations(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(ValidationPipe) updateartistDto: UpdateArtistDto) {
    return this.artistService.update(id, updateartistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.artistService.remove(id);
  }
}