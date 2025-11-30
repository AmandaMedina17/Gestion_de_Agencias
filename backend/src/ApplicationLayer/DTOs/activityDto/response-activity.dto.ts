import { ActivityClassification, ActivityType } from "../../../DomainLayer/Enums";
import { CreateResponsibleDto } from "../responsibleDto/create-responsible.dto";
import { CreatePlaceDto } from "../placeDto/create-place.dto";

export class ActivityResponseDto{
    id!: string;
    classification!: ActivityClassification;
    type!: ActivityType;
    responsibles!: CreateResponsibleDto[];
    places!: CreatePlaceDto[];
    dates!: Date[];
}