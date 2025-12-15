import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { GroupService } from '@application/services/group.service';
import { CreateGroupDto } from '@application/DTOs/groupDto/create-group.dto';
import { UpdateGroupDto } from '@application/DTOs/groupDto/update-group.dto';
import { AddMemberToGroupDto } from '@application/DTOs/membershipDto/add-member-to-group.dto';
import { LeaveGroupDto } from '@application/DTOs/membershipDto/leave-group.dto';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  create(@Body(ValidationPipe) createGroupDto: CreateGroupDto) {
    return this.groupService.create(createGroupDto);
  }

  @Post('addMember')
  addMember(
    @Body(ValidationPipe) addMemberDto: AddMemberToGroupDto,
  ) {
    return this.groupService.addMember(addMemberDto);
  }
  
  @Delete('removeMember')
  removeMember(
    @Body(ValidationPipe) removeMemberDto: LeaveGroupDto,
  ) {
    return this.groupService.removeMember(removeMemberDto);
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

  @Patch(':id/activate')
  activateGroup(@Param('id') id: string){
    return this.groupService.activateGroup(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupService.remove(id);
  }
}
