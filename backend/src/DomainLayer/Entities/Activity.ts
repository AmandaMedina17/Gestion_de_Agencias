import { ActivityClassification, ActivityType } from "../Enums";
import { v4 as uuidv4 } from 'uuid';
import { Responsible } from "./Responsible";
import { Place } from "./Place";
import { UpdateData } from "@domain/UpdateData";
import { IUpdatable } from "@domain/UpdatableInterface";

export class Activity implements IUpdatable{
  constructor(
    private readonly id: string,
    private classification: ActivityClassification,
    private type: ActivityType,
    private _responsibles: Responsible[] = [],
    private _places: Place[] = [],
    private _dates: Date[] = []
  ) { this.validate()}

  update(updateDto: UpdateData): void {
    if(updateDto.classification)
    {
      this.classification = updateDto.classification;
    }
    if(updateDto.type)
    {
      this.type = updateDto.type;
    }
    if(updateDto.responsibles)
    {
      this.validateResponsibles(updateDto.responsibles)
      this._responsibles = updateDto.responsibles;
    }
    if(updateDto.places)
    {
      this.validatePlaces(updateDto.places)
      this._places = updateDto.places
    }
    if(updateDto.dates)
    {
      this.validateDates(updateDto.dates)
      this._dates = updateDto.dates
    }
  }

  private validate(): void {
    if (!this.id || this.id.trim() === "") {
      throw new Error("ID cannot be null or empty");
    }

    if (this.classification === null || this.classification === undefined) {
      throw new Error("Classification cannot be null");
    }

    if (this.type === null || this.type === undefined) {
      throw new Error("Type cannot be null");
    }

    this.validateResponsibles(this._responsibles);
    this.validatePlaces(this._places);
    this.validateDates(this._dates);
  }

  private validateResponsibles(responsibles: Responsible[]): void {
    if (!responsibles || responsibles.length === 0) {
      throw new Error("Activity must have at least one responsible");
    }

    if (responsibles.length > 10) {
      throw new Error("Activity cannot have more than 10 responsibles");
    }

    const uniqueIds = new Set(responsibles.map(r => r.getId()));
    if (uniqueIds.size !== responsibles.length) {
      throw new Error("Activity cannot have duplicate responsibles");
    }
  }

  private validatePlaces(places: Place[]): void {
    if (!places || places.length === 0) {
      throw new Error("Activity must have at least one place");
    }

    const uniqueIds = new Set(places.map(r => r.getId()));
    if (uniqueIds.size !== places.length) {
      throw new Error("Activity cannot have duplicate places");
    }
  }

  private validateDates(dates: Date[]): void {
  if (!dates || dates.length === 0) {
    throw new Error("Activity must have at least one date");
  }

  const now = new Date();
  if (dates.some(date => date < now)) {
      throw new Error("Activity dates cannot be in the past");
    }
  }

  static create(classification: ActivityClassification, type: ActivityType,
    responsibles: Responsible[], places: Place[], dates: Date[]): Activity {
    const id = uuidv4();
    return new Activity(id, classification, type, responsibles, places, dates);
  }

  // Getters
  public getId(): string {return this.id; }
  public getClassification(): ActivityClassification { return this.classification;}
  public getType(): ActivityType { return this.type;}
  public getResponsibles(): Responsible[] { return [...this._responsibles]; }
  public getPlaces(): Place[] { return [...this._places]; }
  public getDates(): Date[] { return [...this._dates]; }

}
