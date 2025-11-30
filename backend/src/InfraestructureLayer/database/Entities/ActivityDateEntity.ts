import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ActivityEntity } from './ActivityEntity';

@Entity('activity_date')
export class ActivityDateEntity {
    @PrimaryColumn({ name: 'activity_id' })
    activityId!: string;

    @PrimaryColumn({ type: 'timestamp' })
    date!: Date; 

    // Relación con Activity
    @ManyToOne(
        () => ActivityEntity, 
        (activity: ActivityEntity) => activity.activityDates, 
        { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'activity_id' })
    activity!: ActivityEntity;
}



