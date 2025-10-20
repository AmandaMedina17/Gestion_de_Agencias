import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Activity } from '../ActivityEntity';
import { ResponsibleEntity } from '../ResponsibleEntity';

@Entity('activity_responsible')
export class ActivityResponsibleEntity {
    @PrimaryColumn({ name: 'activity_id' })
    activityId!: string;

    @PrimaryColumn({ name: 'responsible_id' })
    responsibleId!: string;

    // Relación con Activity
    @ManyToOne(() => Activity, (activity: Activity) => activity.activityResponsibles)
    @JoinColumn({ name: 'activity_id' })
    activity!: Activity;

    // Relación con Responsible
    @ManyToOne(() => ResponsibleEntity, (responsible: ResponsibleEntity) => responsible.activityResponsibles)
    @JoinColumn({ name: 'responsible_id' })
    responsible!: ResponsibleEntity;
}