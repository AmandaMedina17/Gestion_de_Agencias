import { CreateGroupDebutDto } from '@application/DTOs/group_debutDto/create-group-debut.dto';
import { GroupDebutService } from '@application/services/group_debut.service';
import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';

@Controller('groupsDebut')
export class GroupDebutController {
  constructor(private readonly groupDebutService: GroupDebutService) {}

    @Post('create-debut')
    createDebut(
        @Body(ValidationPipe) createDebutDto: CreateGroupDebutDto,
    ){
        return this.groupDebutService.createGroupDebut(createDebutDto);
    }
}