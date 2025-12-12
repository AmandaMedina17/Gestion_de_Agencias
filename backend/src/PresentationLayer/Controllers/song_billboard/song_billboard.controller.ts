import { AddSongToBillboardDto } from '@application/DTOs/SongBillboardDto/add.sonBillboard.dto';
import { SongBillboardService } from '@application/services/song_billboard/song_billboard.service';
import { Body, Controller, Delete, Get, Param, Post, ValidationPipe } from '@nestjs/common';

@Controller('song-billboard')
export class SongBillboardController {
    constructor(private readonly songBillboardService: SongBillboardService){
    }
    @Post()
    create(@Body(ValidationPipe) addSongToBillboard: AddSongToBillboardDto) {
        return this.songBillboardService.add(addSongToBillboard);
    }

    @Get()
    findAll(){
        return this.songBillboardService.findAll()
    }

    @Delete(':songId/:billboardId')
    remove(
        @Param('songId') songId: string,
        @Param('billboardId') billboardId: string
    ) {
        return this.songBillboardService.delete(songId, billboardId);
    }   

    // @Get()
    // finAll(){
    //     return this.songBillboardService.
    // }
    
}
