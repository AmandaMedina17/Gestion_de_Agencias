import { v4 as uuidv4 } from "uuid";
import { ApprenticeStatus, ApprenticeTrainingLevel } from "../Enums";
import { ArtistStatus } from "../Enums";
import { Apprentice } from "./Apprentice";
import { UpdateArtistDto } from "@application/DTOs/artistDto/update-artist.dto";


export class Artist implements IUpdatable<UpdateArtistDto>{
  constructor(
    private id: string,    
    private transitionDate: Date, //fecha del primer debut con el grupo
    private status: ArtistStatus,
    private stageName: string,
    private birthDate: Date,
    private groupId: string,
    public apprenticeId: string
    
  ) {

  }

  static create(transitionDate: Date, status: ArtistStatus, stageName: string, birthDate: Date, groupId: string, apprenticeId: string): Artist {
    const id = uuidv4();
    return new Artist(id, transitionDate, status, stageName, birthDate, groupId, apprenticeId);
  }

  update(updateDto: UpdateArtistDto): void{
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
    if(updateDto.groupId)
    {
      this.groupId = updateDto.groupId;
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

  public getGroup(): string{
    return this.groupId;
  }

   public getApprenticeId(): string {
    return this.apprenticeId;
  }


  public debut(groupId: string, debutDate: Date): void {
    this.groupId = groupId;
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
