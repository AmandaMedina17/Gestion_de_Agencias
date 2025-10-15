import { Place, DateValue } from "../Value Objects/Values";
import { AgencyID } from "../Value Objects/IDs";
import { ApprenticeEntity } from "./ApprenticeEntity";

export class AgencyEntity {
  //lista para grupos
  private recruitedApprentices: ApprenticeEntity[] = [];

  constructor(
    private readonly id: AgencyID,
    private place: Place,
    private nameAgency: string,
    private dateFundation: DateValue
  ) {}

  public getId(): AgencyID {
    return this.id;
  }

  public getPlace(): Place {
    return this.place;
  }

  public getName(): string {
    return this.nameAgency;
  }

  public recruitApprentice(apprentice: ApprenticeEntity): void {
    if (!this.recruitedApprentices.includes(apprentice)) {
      this.recruitedApprentices.push(apprentice);
    }
  }
}
