import { DateValue } from "../Value Objects/Values";
import { v4 as uuidv4 } from "uuid";

export class Agency {
  constructor(
    private readonly id: string,
    private place: string,
    private nameAgency: string,
    private dateFundation: Date
  ) {}

  public getId(): string {
    return this.id;
  }

  public getPlace(): string {
    return this.place;
  }

  public getName(): string {
    return this.nameAgency;
  }

  public getDateFundation() : Date{
    return this.dateFundation;
  }

  public create(place: string, nameAgency: string, dateFundation: Date) : Agency{
    const id = uuidv4();
    return new Agency(id,place,nameAgency,dateFundation);
  }
}
