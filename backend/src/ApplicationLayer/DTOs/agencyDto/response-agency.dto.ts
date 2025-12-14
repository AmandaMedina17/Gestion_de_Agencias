import { PlaceResponseDto } from "../placeDto/response-place.dto";

export class AgencyResponseDto{
    id!:string;
    place!: PlaceResponseDto;
    nameAgency!: string;
    dateFundation!: Date;
}