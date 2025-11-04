import { Place, DateValue } from "../Value Objects/Values";
import { v4 as uuidv4 } from "uuid";

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

  static create( place: Place, nameAgency: string, dateFundation: DateValue): Agency {
    const id = uuidv4();
    return new Agency(id, place, nameAgency, dateFundation);
  }

}
