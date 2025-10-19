import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Activity } from '../ActivityEntity';
import { Date } from '../DateEntity';

@Entity('activity_date')
export class ActivityDateEntity {
    @PrimaryColumn({ name: 'activity_id' })
    activityId!: string;

    @PrimaryColumn({ name: 'date_id' })
    dateId!: string;

    // Relación con Activity
    @ManyToOne(() => Activity, (activity: Activity) => activity.activityDates, {
        primary: true
    })
    @JoinColumn({ name: 'activity_id' })
    activity!: Activity;

    // Relación con Date
    @ManyToOne(() => Date, (date: Date) => date.activityDates, {
        primary: true
    })
    @JoinColumn({ name: 'date_id' })
    date!: Date;
}