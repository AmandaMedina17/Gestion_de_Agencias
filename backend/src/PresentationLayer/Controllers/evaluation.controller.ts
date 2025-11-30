import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { EvaluationService } from '@application/services/evaluation.service';
import { CreateEvaluationDto } from '@application/DTOs/evaluationDto/create-evaluation.dto';
import { UpdateEvaluationDto } from '@application/DTOs/evaluationDto/update-evaluation.dto';

@Controller('apprentice-evaluations')
export class ApprenticeEvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Post()
  create(@Body() createDto: CreateEvaluationDto) {
    return this.evaluationService.create(createDto);
  }

  @Get()
  findAll() {
    return this.evaluationService.findAll();
  }

  @Get('apprentice/:apprenticeId')
  findByApprentice(@Param('apprenticeId') apprenticeId: string) {
    return this.evaluationService.findByApprenticeId(apprenticeId);
  }

  @Get('date/:dateId')
  findByDate(@Param('dateId') dateId: Date) {
    return this.evaluationService.findByDateId(dateId);
  }

  @Get(':apprenticeId/:dateId')
  findOne(
    @Param('apprenticeId') apprenticeId: string,
    @Param('dateId') dateId: Date,
  ) {
    return this.evaluationService.findOne(apprenticeId, dateId);
  }

  @Patch(':apprenticeId/:dateId')
  update(
    @Param('apprenticeId') apprenticeId: string,
    @Param('dateId') dateId: Date,
    @Body(ValidationPipe) updateDto: UpdateEvaluationDto,
  ) {
    return this.evaluationService.update(apprenticeId, dateId, updateDto);
  }

  @Delete(':apprenticeId/:dateId')
  remove(
    @Param('apprenticeId') apprenticeId: string,
    @Param('dateId') dateId: Date,
  ) {
    return this.evaluationService.remove(apprenticeId, dateId);
  }
}