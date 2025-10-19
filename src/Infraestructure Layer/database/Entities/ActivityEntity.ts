import { Entity, PrimaryColumn, Column } from 'typeorm';
import {ActivityClassification, ActivityType} from '';

@Entity()
export class Activity {
    @PrimaryColumn()
    id: string;

    @Column({
    type: 'enum',
    enum: ActivityClassification,
    })
    classification: ActivityClassification;

    @Column({
    type: 'enum',
    enum: ActivityType,
    })
    type: ActivityType;
}