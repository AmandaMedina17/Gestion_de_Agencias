import { v4 as uuidv4 } from "uuid";
import { ApprenticeStatus, ApprenticeTrainingLevel } from "../Enums";
import { ArtistStatus } from "../Enums";
import { Apprentice } from "./Apprentice";
import { IUpdatable } from "../UpdatableInterface";
import { UpdateData } from "../UpdateData";

export class Artist implements IUpdatable{
  constructor(
    private id: string,    
    private transitionDate: Date, //fecha del primer debut con el grupo
    private status: ArtistStatus,
    private stageName: string,
    private birthDate: Date,
    public apprenticeId: string
  ) {

  }

  static create(transitionDate: Date, status: ArtistStatus, stageName: string, birthDate: Date, apprenticeId: string): Artist {
    const id = uuidv4();
    return new Artist(id, transitionDate, status, stageName, birthDate, apprenticeId);
  }

  update(updateDto: UpdateData): void{
    if(updateDto.stageName)
    {
      this.stageName = updateDto.stageName;
    }
    if(updateDto.transitionDate)
    {
      this.transitionDate = updateDto.transitionDate;
    }
    if(updateDto.status)
    {
      this.status = updateDto.status;
    }
    if(updateDto.birthday)
    {
      this.birthDate = updateDto.birthday;
    }
  }

  

  //metdo para conflicto de agenda FALTA
  public getId():string{
    return this.id;
  }

  public getStageName(): string {
    return this.stageName;
  }

  public getBirthDate(): Date {
    return this.birthDate;
  }

  public getDebutDate(): Date {
    if (this.transitionDate) return this.transitionDate;
    else throw new Error("No ha debutado");
  }

  public getStatusArtist(): ArtistStatus {
    return this.status;
  }

   public getApprenticeId(): string {
    return this.apprenticeId;
  }


  public debut(debutDate: Date): void {
    this.transitionDate = debutDate;
    this.status = ArtistStatus.ACTIVO;
  }

  private static calculateElapsedYears(date: Date): number {
    const today = new Date();
    let years = today.getFullYear() - date.getFullYear();
    
    // Ajustar si el cumpleaños no ha ocurrido este año
    const birthdayThisYear = new Date(today.getFullYear(), date.getMonth(), date.getDate());
    if (today < birthdayThisYear) {
      years--;
    }
    
    return years;
  }

  
}
