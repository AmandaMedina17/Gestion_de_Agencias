import { v4 as uuidv4 } from "uuid";
import { DateValue } from "../Value Objects/Values";
import { ApprenticeStatus, ApprenticeTrainingLevel } from "../Enums";
import { ArtistStatus } from "../Enums";
import { Apprentice } from "./Apprentice";


export class Artist extends Apprentice {
  constructor(
    id: string,
    entryDate: DateValue,
    private statusArtist: ArtistStatus,
    private stageName: string,
    private realName: string,
    private birthDate: DateValue,
    private transitionDate: DateValue, //fecha del primer debut con el grupo
    private groupId?: string,
    
  ) {

    const age = Artist.calculateElapsedYears(birthDate);
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

  public getBirthDate(): DateValue {
    return this.birthDate;
  }

  public getDebutDate(): DateValue {
    if (this.transitionDate) return this.transitionDate;
    else throw new Error("No ha debutado");
  }

  public getStatusArtist(): ArtistStatus {
    return this.statusArtist;
  }

  public getAge(): number {
  return Artist.calculateElapsedYears(this.birthDate);
}

  public debut(groupId: string, debutDate: DateValue): void {
    this.groupId = groupId;
    this.transitionDate = debutDate;
    this.statusArtist = ArtistStatus.ACTIVO;
  }

  private static calculateElapsedYears(date: DateValue): number {
    const today = DateValue.today();
    let years = today.getYear() - date.getYear();
    
    // Ajustar si el cumpleaños no ha ocurrido este año
    const birthdayThisYear = DateValue.fromNumber(
        today.getYear(), 
        date.getMonth(), 
        date.getDay()
    );
    
    if (today.isBefore(birthdayThisYear)) {
        years--;
    }
    
    return years;
}

  // public create(entryDate: Date, statusArtist: ArtistStatus, stageName: string, realName: string, birthDate: Date, transitionDate: Date, groupId?: string,): Artist {
  //   const id = uuidv4();
  //   return new Artist(id, entryDate, statusArtist, stageName, realName, birthDate, transitionDate, groupId);
  // }
}
