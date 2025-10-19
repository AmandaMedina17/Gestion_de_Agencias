import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { GroupEntity } from '../GroupEntity';
import { Activity } from '../ActivityEntity';

@Entity('group_activity')
export class GroupActivityEntity {
    @PrimaryColumn({ name: 'group_id' })
    groupId!: string;

    @PrimaryColumn({ name: 'activity_id' })
    activityId!: string;

    // Relación con GroupEntity
    @ManyToOne(() => GroupEntity, (group: GroupEntity) => group.groupActivities,
    {
        primary: true // Indica que esta relación es parte de la clave primaria
    })
    @JoinColumn({ name: 'group_id' })
    group!: GroupEntity;

    // Relación con ActivityEntity
    @ManyToOne(() => Activity, (activity: Activity) => activity.groupActivities, {
        primary: true // Indica que esta relación es parte de la clave primaria
    })
    @JoinColumn({ name: 'activity_id' })
    activity!: Activity;

    // Campo adicional para la confirmación
    @Column({ name: 'confirmation', type: 'boolean', default: true })
    confirmation!: boolean;

}