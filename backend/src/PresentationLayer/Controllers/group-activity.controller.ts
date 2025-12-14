import { GetGroupCalendaryDto } from "@application/DTOs/schedule-groupDto/group_calendary.dto";
import { ScheduleGroupDto } from "@application/DTOs/schedule-groupDto/schedule-group.dto";
import { GroupActivityService } from "@application/services/group-activity.service";
import { Body, Controller, Get, Param, Post, ValidationPipe } from "@nestjs/common";

@Controller('group-scheduling')
export class GroupActivityController {
  constructor(
    private readonly group_activity_service: GroupActivityService,
  ) {}

  @Post('schedule')
  async scheduleGroup(@Body(ValidationPipe) scheduleGroupDto: ScheduleGroupDto) {
    await this.group_activity_service.scheduleGroup(scheduleGroupDto);
  }

  @Post('/activities')
  getGroupActivities(@Body(ValidationPipe) dto: GetGroupCalendaryDto) {
    return this.group_activity_service.getGroupActivities(dto)
  }
}