import { BillboardListScope } from "../../../DomainLayer/Enums";

export class ResponseBillboardListDto{
    id!: string;
    publicDate!: Date;
    scope!: BillboardListScope;
    nameList!: string;
    endList!: number
}      