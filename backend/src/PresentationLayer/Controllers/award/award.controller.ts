import { CreateAwardDto } from '@application/DTOs/AwardDto/create.award.dto';
import { UpdateAwardDto } from '@application/DTOs/AwardDto/update.award.dto';
import { AwardService } from '@application/services/award/award.service';
import { Body, Controller, Delete, Get, Param, Patch, Post, ValidationPipe } from '@nestjs/common';

@Controller('award')
export class AwardController {
    constructor(private readonly awardService: AwardService) {}

    @Post()
    create(@Body(ValidationPipe) createAwardDto: CreateAwardDto) {
        return this.awardService.create(createAwardDto);
    }

    @Post(":awardId/:albumId")
    assingAwardToBillboard(
        @Param('awardId') awardId: string,
        @Param('albumId') albumId: string
    ) {
        return this.awardService.addAwardToAlbum(awardId, albumId);
    }  

    @Get()
    findAll() {
        return this.awardService.findAll();
    }


    @Get('unassigned')
    findUnassignedAwards() {
        return this.awardService.findUnassignedAwards();
    }
    
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.awardService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body(ValidationPipe) updateAwardDto: UpdateAwardDto) {
        return this.awardService.update(id, updateAwardDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.awardService.remove(id);
    }
}
