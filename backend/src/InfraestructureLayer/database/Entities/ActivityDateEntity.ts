import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ActivityEntity } from './ActivityEntity';
import { DateEntity } from './DateEntity';

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
    @ManyToOne(() => DateEntity, (date: DateEntity) => date.activityDates)
    @JoinColumn({ name: 'date_id' })
    date!: DateEntity;
}