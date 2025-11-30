import { CreateSongDto } from '@application/DTOs/songDto/create.song.dto';
import { UpdateSongDto } from '@application/DTOs/songDto/update.song.dto';
import { SongService } from '@application/services/song/song.service';
import { Body, Controller, Delete, Get, Param, Patch, Post, ValidationPipe } from '@nestjs/common';

@Controller('song')
export class SongController {
    constructor(private readonly songService: SongService) {}
    
      @Post()
      create(@Body(ValidationPipe) createSongDto: CreateSongDto) {
        return this.songService.create(createSongDto);
      }
    
      @Get()
      findAll() {
        return this.songService.findAll();
      }
    
      @Get(':id')
      findOne(@Param('id') id: string) {
        return this.songService.findOne(id);
      }
    
      @Patch(':id')
      update(@Param('id') id: string, @Body(ValidationPipe) updateSongDto: UpdateSongDto) {
        return this.songService.update(id, updateSongDto);
      }
    
      @Delete(':id')
      remove(@Param('id') id: string) {
        return this.songService.remove(id);
      }
}
