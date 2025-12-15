import { Group } from "@domain/Entities/Group";
import { IGroupRepository } from "@domain/Repositories/IGroupRepository";
import { ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateGroupDebutDto } from "@application/DTOs/group_debutDto/create-group-debut.dto";
import { IGroupActivityRepository } from "@domain/Repositories/IGroupActivityRepository";
import { IActivityRepository } from "@domain/Repositories/IActivityRepository";
import { ActivityType } from "@domain/Enums";
import { Activity } from "@domain/Entities/Activity";
import { IAlbumRepository } from "@domain/Repositories/IAlbumRepository";
import { Album } from "@domain/Entities/Album";

@Injectable()
export class CreateGroupDebutUseCase {
  constructor(
    @Inject(IGroupRepository)
    private readonly groupRepository: IGroupRepository,
    @Inject(IGroupActivityRepository)
    private readonly groupActivityRepository: IGroupActivityRepository,
    @Inject(IActivityRepository)
    private readonly activityRepository: IActivityRepository,
    @Inject(IAlbumRepository)
    private readonly albumRepository: IAlbumRepository,
  ) {}

  async execute(createGroupDebutDto: CreateGroupDebutDto): Promise<{domainActivities: Activity[],group: Group, album: Album}> {
    const { groupId, activities, albumId, visualConcept } = createGroupDebutDto;

    //Verificar que el grupo existe
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
    }

    if(group.getHasDebuted()){
      throw new ConflictException('El grupo ya ha debutado');
    }

    if(!group.isCreated()){
      throw new ConflictException('El grupo aun no se ha creado, no puede debutar');
    }
    // Verificar que haya miembros en el grupo
    const members = await this.groupRepository.getGroupMembers(groupId);
    if (members.length === 0) {
      throw new ConflictException(`El grupo no tiene miembros. No puede debutar sin miembros.`);
    }

    const album = await this.albumRepository.findById(albumId);
    if (!album) {
        throw new NotFoundException(`Album con ${albumId} no encontrado`);
    }

    // Relacionar album con grupo
    this.albumRepository.assignToGroup(albumId, groupId);

    for (const activityId of activities) {
      const activity = await this.activityRepository.findById(activityId);
      
      if (!activity) {
        throw new NotFoundException(`Actividad con ID ${activityId} no encontrada`);
      }

      // Verificar que la actividad sea de tipo GRUPAL
      if (activity.getType() !== ActivityType.GRUPAL) {
        throw new ConflictException(
          `La actividad ${activityId} no es de tipo GRUPAL. Solo se pueden usar actividades grupales para el debut.`
        );
      }
    }

    const activitiesDomain : Activity[] = []; 

    for (const activityId of activities) {
      // Verificar que no esté ya programado
      const alreadyScheduled = await this.groupActivityRepository.isGroupScheduled(groupId, activityId);
      
      if (!alreadyScheduled) {
        await this.groupActivityRepository.scheduleGroup(groupId, activityId);
        const act = await this.activityRepository.findById(activityId);
        if(act){
            activitiesDomain.push(act);
        }
      }
    }

    group.setVisualConcept(visualConcept);
    group.setDebuted();

    //Actualizar el estado del grupo en la base de datos
    await this.groupRepository.save(group);
    
    return {domainActivities: activitiesDomain, group: group, album: album}
    }
}
   