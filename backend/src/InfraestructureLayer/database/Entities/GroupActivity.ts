import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { GroupEntity } from './GroupEntity';
import { ActivityEntity } from './ActivityEntity';

@Entity('group_activity')
export class GroupActivityEntity {
    @PrimaryColumn({ name: 'group_id' })
    groupId!: string;

    @PrimaryColumn({ name: 'activity_id' })
    activityId!: string;

    // Relación con GroupEntity
    @ManyToOne(() => GroupEntity, (group: GroupEntity) => group.groupActivities, {onDelete: 'CASCADE'})
    @JoinColumn({ name: 'group_id' })
    group!: GroupEntity;

    // Relación con ActivityEntity
    @ManyToOne(() => ActivityEntity, (activity: ActivityEntity) => activity.groupActivities)
    @JoinColumn({ name: 'activity_id' })
    activity!: ActivityEntity;

    // Campo adicional para la confirmación
    @Column({ name: 'confirmation', type: 'boolean', default: true })
    confirmation!: boolean;

}