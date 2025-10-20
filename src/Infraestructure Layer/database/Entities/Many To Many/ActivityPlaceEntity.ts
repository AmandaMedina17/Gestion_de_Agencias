import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Activity } from '../ActivityEntity';
import { PlaceEntity } from '../PlaceEntity';

@Entity('activity_place')
export class ActivityPlaceEntity {
    @PrimaryColumn({ name: 'activity_id' })
    activityId!: string;

    @PrimaryColumn({ name: 'place_id' })
    placeId!: string;

    // Relación con Activity
    @ManyToOne(() => Activity, (activity: Activity) => activity.activityPlaces)
    @JoinColumn({ name: 'activity_id' })
    activity!: Activity;

    // Relación con Place
    @ManyToOne(() => PlaceEntity, (place: PlaceEntity) => place.activityPlaces)
    @JoinColumn({ name: 'place_id' })
    place!: PlaceEntity;
}