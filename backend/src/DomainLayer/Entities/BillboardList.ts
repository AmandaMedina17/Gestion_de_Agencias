import { DateValue } from "../Value Objects/Values";
import { BillboardListScope } from "../Enums";
import { v4 as uuidv4 } from "uuid";

export class BillboardList {
  constructor(
    private readonly id: string,
    private publicDate: DateValue,
    private scope: BillboardListScope,
    private nameList: string,
  ) {}
  public getId(): string {
    return this.id;
  }

  public getNameList(): string {
    return this.nameList;
  }
 
  public getPublicDate() : DateValue {
    return this.publicDate;
  }

  public getScope(): BillboardListScope {
    return this.scope;
  }

  public create( publicDate: DateValue, scope: BillboardListScope, nameList: string, endList: number ) :BillboardList {
    const id = uuidv4();
    return new BillboardList(id, publicDate, scope, nameList);
  }
   
}
