import { AssignAlbumToArtistDto } from '@application/DTOs/albumDto/assign-album-to-artist.dto';
import { AssignAlbumToGroupDto } from '@application/DTOs/albumDto/assign-album-to-group.dto';
import { CreateAlbumDto } from '@application/DTOs/albumDto/create.album.dto';
import { UpdateAlbumDto } from '@application/DTOs/albumDto/update.album.dto';
import { AlbumService } from '@application/services/album/album.service';
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, ValidationPipe } from '@nestjs/common';

@Controller('album')
export class AlbumController {
    constructor(private readonly albumService: AlbumService) {}
        
          @Post()
          create(@Body(ValidationPipe) createSongDto: CreateAlbumDto) {
            return this.albumService.create(createSongDto);
          }
        
          @Get()
          findAll() {
            return this.albumService.findAll();
          }
          

          @Get('hits/:id')
          getHits(@Param('id') id: string) {
            return this.albumService.getAlbumHits(id);
          }

          @Get('songs/:id')
          getSongs(@Param('id') id: string) {
            return this.albumService.getAllSongs(id);
          }

          @Get('awards/:id')
          getAwards(@Param('id') id: string) {
            return this.albumService.getAlbumAwards(id);
          }

          @Get(':id')
          findOne(@Param('id') id: string) {
            return this.albumService.findOne(id);
          }
        
          @Patch(':id')
          update(@Param('id') id: string, @Body(ValidationPipe) updateAlbumDto: UpdateAlbumDto) {
            return this.albumService.update(id, updateAlbumDto);
          }
        
          @Delete(':id')
          remove(@Param('id') id: string) {
            return this.albumService.remove(id);
          }

          @Get('hits/:id')
          getHits(@Param('id') id: string) {
            return this.albumService.getAlbumHits(id);
          }
          @Get('songs/:id')
          getSongs(@Param('id') id: string) {
            return this.albumService.getAllSongs(id);
          }

          @Put('assign-to-artist')
          async assignToArtist(@Body() dto: AssignAlbumToArtistDto) {
            return await this.albumService.assignToArtist(dto);
          }

          @Put('assign-to-group')
          async assignToGroup(@Body() dto: AssignAlbumToGroupDto) {
              return await this.albumService.assignToGroup(dto);
          }

          @Get('artist/:artistId')
          async getAlbumsByArtist(@Param('artistId') artistId: string) {
              return await this.albumService.getAlbumsByArtist(artistId);
          }

          @Get('group/:groupId')
          async getAlbumsByGroup(@Param('groupId') groupId: string) {
              return await this.albumService.getAlbumsByGroup(groupId);
          }
}
