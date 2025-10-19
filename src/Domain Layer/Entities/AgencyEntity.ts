import { Place, DateValue } from "../Value Objects/Values";
import { v4 as uuidv4 } from "uuid";
import { ApprenticeEntity } from "./ApprenticeEntity";
import { GroupEntity } from "./GroupEntity";
import { IntervalEntity } from "./IntervalEntity";

export class AgencyEntity {
  constructor(
    private readonly id: string = uuidv4(),
    private place: Place,
    private nameAgency: string,
    private dateFundation: DateValue
  ) {}

  public getId(): string {
    return this.id;
  }

  public getPlace(): Place {
    return this.place;
  }

  public getName(): string {
    return this.nameAgency;
  }

  // public recruitApprentice(apprentice: ApprenticeEntity): void {
  //   if (!this.recruitedApprentices.includes(apprentice)) {
  //     this.recruitedApprentices.push(apprentice);
  //   }
  // }
}
