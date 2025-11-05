import { v4 as uuidv4 } from 'uuid';

export class Income{
    constructor(
        private ingressId: string,
        private activityId: string,
        private mount: number,
        private date: Date,
        private responsible: string
    ){
        this.validate();
    }

    private validate(): void {
      if (!this.ingressId || this.ingressId.trim() === "") {
        throw new Error("ID cannot be null or empty");
      }

      if (!this.activityId || this.activityId.trim() === "") {
        throw new Error("ID cannot be null or empty");
      }

      if (this.mount === null) {
        throw new Error("Mount cannot be null");
      }

      if (this.date === null) {
        throw new Error("Date cannot be null");
      }

      if (this.responsible === null) {
        throw new Error("Responsible cannot be null");
      }
    }

    static create(activityId: string, mount: number, date: Date, responsible: string ): Income {
      const id = uuidv4();
      return new Income(id, activityId, mount, date, responsible);
    }
    
    public getID() : string {
        return this.ingressId;
    }

    public GetActivityID() : string {
        return this.activityId;
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
