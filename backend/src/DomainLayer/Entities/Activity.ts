import { ActivityClassification, ActivityType } from "../Enums";
import { v4 as uuidv4 } from 'uuid';

export class Activity {
  constructor(
    private readonly id: string,
    private classification: ActivityClassification,
    private type: ActivityType
  ) {
    this.validate();
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
  }

  static create( classification: ActivityClassification, type: ActivityType): Activity {
    const id = uuidv4();
    return new Activity(id, classification, type);
  }

  // Getters
  public getId(): string {
    return this.id;
  }

  public getClassification(): ActivityClassification {
    return this.classification;
  }

  public getType(): ActivityType {
    return this.type;
  }
}
