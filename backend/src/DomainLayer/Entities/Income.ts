import { IncomeType } from '@domain/Enums';
import { IUpdatable } from '@domain/UpdatableInterface';
import { UpdateData } from '@domain/UpdateData';
import { v4 as uuidv4 } from 'uuid';

export class Income implements IUpdatable{
    constructor(
        private ingressId: string,
        private activityId: string,
        private type: IncomeType,
        private mount: number,
        private date: Date,
        private responsible: string
    ){
        this.validate();
    }

    update(updateDto: UpdateData): void {
      throw new Error('Method not implemented.');
    }

    private validate(): void {
      if (!this.ingressId || this.ingressId.trim() === "") {
        throw new Error("ID cannot be null or empty");
      }

      if (!this.activityId || this.activityId.trim() === "") {
        throw new Error("ID cannot be null or empty");
      }

      if (this.type === null || this.type === undefined) {
        throw new Error("Type cannot be null");
      }

      this.validateMount()

      this.validateDate()

      if (this.responsible === null) {
        throw new Error("Responsible cannot be null");
      }
    }

    private validateMount()
    {
      if (this.mount === null) {
        throw new Error("Mount cannot be null");
      }
      if (this.mount < 0)
      {
        throw new Error("Mount cannot be negative");
      }
    }

     private validateDate(): void {
      if (!this.date) {
        throw new Error("Date cannot be null");
      }

      const now = new Date();
      if (this.date < now) {
          throw new Error("Income dates cannot be in the past");
        }
      }

    static create(activityId: string, type: IncomeType, mount: number, date: Date, responsible: string ): Income {
      const id = uuidv4();
      return new Income(id, activityId, type, mount, date, responsible);
    }
    
    public getID() : string {
        return this.ingressId;
    }

    public GetActivityID() : string {
        return this.activityId;
    }

    public GetType() : IncomeType {
        return this.type;
    }
    
    public getMount(): number {
        return this.mount;
    }

    public getDate(): Date {
        return this.date;
    }

    public getResponsible(): string{
        return this.responsible;
    }
}
