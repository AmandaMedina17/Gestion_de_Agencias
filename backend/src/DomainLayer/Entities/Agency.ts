import { DateValue } from "../Value Objects/Values";
import { Place } from "./Place";
import { v4 as uuidv4 } from "uuid";
import { Apprentice } from "./Apprentice";
import { Group } from "./Group";
import { Interval } from "./Interval";

export class Agency {
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
