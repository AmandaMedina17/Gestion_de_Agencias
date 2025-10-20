import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ActivityEntity } from '../ActivityEntity';
import { Date } from '../DateEntity';

@Entity('activity_date')
export class ActivityDateEntity {
    @PrimaryColumn({ name: 'activity_id' })
    activityId!: string;

    @PrimaryColumn({ name: 'date_id' })
    dateId!: string;

    // Relación con Activity
    @ManyToOne(() => ActivityEntity, (activity: ActivityEntity) => activity.activityDates)
    @JoinColumn({ name: 'activity_id' })
    activity!: ActivityEntity;

    // Relación con Date
    @ManyToOne(() => Date, (date: Date) => date.activityDates)
    @JoinColumn({ name: 'date_id' })
    date!: Date;
}