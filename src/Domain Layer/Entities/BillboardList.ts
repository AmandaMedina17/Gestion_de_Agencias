import { DateValue } from "../Value Objects/Values";
import { BillboardListScope } from "../Enums";
import { v4 as uuidv4 } from "uuid";;

export class BillboardList {
  constructor(
    private readonly id: string = uuidv4(),
    private publicDate: DateValue,
    private scope: BillboardListScope,
    private nameList: string,
    private endList: number //cuantos puesto abarca la lista
  ) {}

  public getEndList(): number {
    return this.endList;
  }

  public getNameList(): string {
    return this.nameList;
  }
}
