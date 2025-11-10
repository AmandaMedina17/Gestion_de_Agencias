import { v4 as uuidv4 } from "uuid";
import { ApprenticeStatus, ApprenticeTrainingLevel } from "../Enums";
import { ArtistStatus } from "../Enums";
import { Apprentice } from "./Apprentice";


export class Artist extends Apprentice {
  constructor(
    id: string,
    entryDate: Date,
    private statusArtist: ArtistStatus,
    private stageName: string,
    private realName: string,
    private birthDate: Date,
    private transitionDate: Date, //fecha del primer debut con el grupo
    private groupId?: string,
    
  ) {

    const age = Artist.calcularAnosTranscurridos(birthDate);
    super(
      id,
      realName,
      age,
      entryDate,
      ApprenticeTrainingLevel.AVANZADO,
      ApprenticeStatus.PROCESO_DE_SELECCION
    );
  }

  //metdo para conflicto de agenda FALTA

  public getStageName(): string {
    return this.stageName;
  }

  public getRealName(): string {
    return this.realName;
  }

  public getBirthDate(): Date {
    return this.birthDate;
  }

  public getDebutDate(): Date {
    if (this.transitionDate) return this.transitionDate;
    else throw new Error("No ha debutado");
  }

  public getStatusArtist(): ArtistStatus {
    return this.statusArtist;
  }

//   public getAge(): number {
//   return Artist.calculateElapsedYears(this.birthDate);
// }

  public debut(groupId: string, debutDate: Date): void {
    this.groupId = groupId;
    this.transitionDate = debutDate;
    this.statusArtist = ArtistStatus.ACTIVO;
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

  // public create(entryDate: Date, statusArtist: ArtistStatus, stageName: string, realName: string, birthDate: Date, transitionDate: Date, groupId?: string,): Artist {
  //   const id = uuidv4();
  //   return new Artist(id, entryDate, statusArtist, stageName, realName, birthDate, transitionDate, groupId);
  // }
}
