import { IncomeType } from '@domain/Enums';
import { IUpdatable } from '@domain/UpdatableInterface';
import { UpdateData } from '@domain/UpdateData';
import { v4 as uuidv4 } from 'uuid';

export class Income implements IUpdatable {
    constructor(
        private ingressId: string,
        private activityId: string,
        private type: IncomeType,
        private mount: number,
        private date: Date,
        private responsible: string
    ) {
        this.validate();
    }

    update(updateDto: UpdateData): void {
      if (updateDto.type !== undefined) {
        this.validateIncomeType(updateDto.type); 
        this.type = updateDto.type;
      }

      if (updateDto.mount !== undefined) {
        this.validateMount(updateDto.mount); 
        this.mount = updateDto.mount;
      }

      if (updateDto.date !== undefined) {
        this.validateDate(updateDto.date); 
        this.date = updateDto.date;
      }

      if (updateDto.responsible !== undefined) {
        this.validateResponsible(updateDto.responsible)
        this.responsible = updateDto.responsible;
      }

      if (updateDto.activityId && updateDto.activityId !== this.activityId) {
        throw new Error("Cannot change the activity ID of an income. Create a new income instead.");
      }
    }

    private validate(): void {
      if (!this.ingressId || this.ingressId.trim() === "") {
        throw new Error("ID cannot be null or empty");
      }

      if (!this.activityId || this.activityId.trim() === "") {
        throw new Error("Activity ID cannot be null or empty");
      }

      this.validateIncomeType(this.type); 
      this.validateMount(this.mount);
      this.validateDate(this.date);
      this.validateResponsible(this.responsible)
    }

    private validateResponsible(responsible: string){
      if (!responsible || responsible.trim() === "") {
        throw new Error("Responsible cannot be null or empty");
      }
    }

    private validateIncomeType(type: IncomeType): void {
      if (type === null || type === undefined) {
        throw new Error("Income type cannot be null");
      }
      if (!Object.values(IncomeType).includes(type)) {
        throw new Error(`Invalid income type: ${type}. Valid types are: ${Object.values(IncomeType).join(', ')}`);
      }
    }

    private validateMount(mount: number): void {
      if (mount === null || mount === undefined) {
        throw new Error("Mount cannot be null");
      }
      if (mount <= 0) {
        throw new Error("Mount cannot be negative or zero");
      }
    }

    private validateDate(date: Date): void {
      if (!date) {
        throw new Error("Date cannot be null");
      }
      const now = new Date();
      if (date < now) {
        throw new Error("Income date cannot be in the past");
      }
    }

    static create(activityId: string, type: IncomeType, mount: number, date: Date, responsible: string): Income {
      const id = uuidv4();
      return new Income(id, activityId, type, mount, date, responsible);
    }
    
    // Getters
    public getID(): string {
        return this.ingressId;
    }

    public GetActivityID(): string {
        return this.activityId;
    }

    public GetType(): IncomeType {
        return this.type;
    }
    
    public getMount(): number {
        return this.mount;
    }

    public getDate(): Date {
        return this.date;
    }

    public getResponsible(): string {
        return this.responsible;
    }
}