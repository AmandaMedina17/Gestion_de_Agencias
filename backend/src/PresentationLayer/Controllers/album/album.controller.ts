import { CreateAlbumDto } from '@application/DTOs/albumDto/create.album.dto';
import { UpdateAlbumDto } from '@application/DTOs/albumDto/update.album.dto';
import { AlbumService } from '@application/services/album/album.service';
import { Body, Controller, Delete, Get, Param, Patch, Post, ValidationPipe } from '@nestjs/common';

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
}
