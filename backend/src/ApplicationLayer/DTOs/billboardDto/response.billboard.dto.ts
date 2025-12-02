import { BillboardList } from "@domain/Entities/BillboardList";
import { BillboardListScope } from "@domain/Enums";

export class ResponseBillboardListDto{
    id!: string;
    publicDate!: Date;
    scope!: BillboardListScope;
    nameList!: string;
    endList!: number
}      