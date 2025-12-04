import { ValidationPipe, Controller, Get, Post, Put, Delete, Body, Param, Query, Inject, Patch } from '@nestjs/common';
import { ArtistService } from '@application/services/artist.service';
import { UpdateApprenticeDto } from '@application/DTOs/apprenticeDto/update-apprentice.dto';
import { CreateArtistDto } from '@application/DTOs/artistDto/create-artist.dto';
import { UpdateArtistDto } from '@application/DTOs/artistDto/update-artist.dto';
import { GetArtistsWithAgencyChangesAndGroupsUseCase } from '../../ApplicationLayer/UseCases/get_artists_with_agency_changes_and_groups.use-case';

@Controller('artist')
export class ArtistController {
  constructor(
    private readonly artistService: ArtistService,
    private readonly getArtistsWithAgencyChangesAndGroupsUseCase: GetArtistsWithAgencyChangesAndGroupsUseCase,
  ) {}

  @Post()
  create(@Body(ValidationPipe) createArtistDto: CreateArtistDto) {
  return this.artistService.create(createArtistDto);
  }

  @Get()
  findAll() {
    return this.artistService.findAll();
  }
  @Get('agency-changes-and-groups')
  getArtistsWithAgencyChangesAndGroups(){
    return this.artistService.getArtistsWithAgencyChangesAndGroups();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artistService.findOne(id);
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