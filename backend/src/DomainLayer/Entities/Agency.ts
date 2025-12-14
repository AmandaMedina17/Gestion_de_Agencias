import { v4 as uuidv4 } from "uuid";
import { IUpdatable } from '../UpdatableInterface'
import { UpdateData } from '../UpdateData';
import { Place } from "./Place";

export class Agency  implements IUpdatable{
  constructor(
    private readonly id: string,
    private place: Place,
    private nameAgency: string,
    private dateFundation: Date
  ) {
    this.validate()
  }

  private validate_name(name:string): void{
      if (name === null || name.trim() === "") {
        throw new Error("Name cannot be null or empty");
      }
  }

  private validate_place(place:Place): void{
      if (place === null) {
        throw new Error("Agency place cannot be null");
      }
  }

  private validate_date(date:Date): void{ 

      if (date === null) {
        throw new Error("Agency fundation date cannot be null");
      }

      const today = new Date();
      
      if (date > today) {
        throw new Error('La fecha de fundación no puede ser en el futuro');
      }
    }

  private validate(): void {
      if (!this.id || this.id.trim() === "") {
        throw new Error("ID cannot be null or empty");
      }
      this.validate_date(this.dateFundation);
      this.validate_name(this.nameAgency);
      this.validate_place(this.place);
  }

  update(updateDto: UpdateData): void {
    if(updateDto.nameAgency){
      this.validate_name(updateDto.nameAgency);
      this.nameAgency = updateDto.nameAgency;
    }
    if(updateDto.place){
      this.validate_place(updateDto.place);
      this.place = updateDto.place;
    }
    if(updateDto.dateFundation){
      this.validate_date(updateDto.dateFundation);
      this.dateFundation = updateDto.dateFundation;
    }
  }

  public getId(): string {
    return this.id;
  }

  public getPlace(): Place {
    return this.place;
  }

  public getName(): string {
    return this.nameAgency;
  }

  public getDateFundation() : Date{
    return this.dateFundation;
  }

  static create(place: Place, nameAgency: string, dateFundation: Date) : Agency{
    const id = uuidv4();
    return new Agency(id,place,nameAgency,dateFundation);
  }
}
