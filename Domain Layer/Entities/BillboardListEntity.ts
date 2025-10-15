import { DateValue } from "../Value Objects/Values";
import { BillboardListScope } from "../Enums";
import { BillboardID } from "../Value Objects/IDs";

export class BillboardListEntity {
  constructor(
    private readonly id: BillboardID,
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
