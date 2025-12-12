import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { GroupService } from '@application/services/group.service';
import { CreateGroupDto } from '@application/DTOs/groupDto/create-group.dto';
import { UpdateGroupDto } from '@application/DTOs/groupDto/update-group.dto';
import { AddMemberToGroupDto } from '@application/DTOs/membershipDto/add-member-to-group.dto';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  create(@Body(ValidationPipe) createGroupDto: CreateGroupDto) {
    return this.groupService.create(createGroupDto);
  }

  @Post(':id/members')
  addMember(
    @Param('id') groupId: string,
    @Body(ValidationPipe) addMemberDto: AddMemberToGroupDto,
  ) {
    return this.groupService.addMember(groupId, addMemberDto);
  }

  @Get()
  findAll() {
    return this.groupService.findAll();
  }

  @Get('not-created')
  getNotCreatedGroups(){
    return this.groupService.getNotCreatedGroups();
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupService.findOne(id);
  }

  @Get(':id/members')
  getGroupMembers(@Param('id') id: string) {
    return this.groupService.getGroupMembers(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(ValidationPipe) updateGroupDto: UpdateGroupDto) {
    return this.groupService.update(id, updateGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupService.remove(id);
  }
}
