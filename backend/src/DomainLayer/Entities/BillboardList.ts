import { DateValue } from "../Value Objects/Values";
import { BillboardListScope } from "../Enums";
import { v4 as uuidv4 } from "uuid";
import { IUpdatable } from "@domain/UpdatableInterface";
import { UpdateData } from "@domain/UpdateData";

export class BillboardList implements IUpdatable {
  constructor(
    private readonly id: string,
    private publicDate: Date,
    private scope: BillboardListScope,
    private nameList: string,
    private endList: number
  ) {}

  update(updateDto: UpdateData): void {
    const billboardUpdate = BillboardList.create(updateDto.publicDate, updateDto.scope, 
      updateDto.nameList, updateDto.endList)
  
    this.publicDate = billboardUpdate.publicDate
    this.scope = billboardUpdate.scope!= undefined ? billboardUpdate.scope : this.scope
    this.nameList = billboardUpdate.nameList!= undefined ? billboardUpdate.nameList: this.nameList
    this.endList = billboardUpdate.endList!= undefined ? billboardUpdate.endList : this.endList
  }
  public getId(): string {
    return this.id;
  }

  public getNameList(): string {
    return this.nameList;
  }
 
  public getPublicDate() : Date {
    return this.publicDate;
  }

  public getScope(): BillboardListScope {
    return this.scope;
  }

  public getEndList(): number{
    return this.endList;
  }

  public static create( publicDate: Date, scope: BillboardListScope, nameList: string, endList: number ) :BillboardList {
    const id = uuidv4();
    return new BillboardList(id, publicDate, scope, nameList, endList);
  }
   
}
