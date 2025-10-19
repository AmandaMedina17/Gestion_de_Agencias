import { v4 as uuidv4 } from "uuid";
import { DateValue } from "../Value Objects/Values";
import { ApprenticeStatus, ApprenticeTrainingLevel } from "../Enums";
import { ArtistRole, ArtistStatus } from "../Enums";
import { Apprentice} from "./Apprentice";
import { Group} from "./Group";
import { Interval} from "./Interval";
import { Agency} from "./Agency";

export class Artist extends Apprentice{
  constructor(
    id: string = uuidv4(),
    entryDate: DateValue,
    agencyId: string,
    private statusArtist: ArtistStatus,
    private stageName: string,
    private realName: string,
    private birthDate: DateValue,
    private transitionDate: DateValue | null, //fecha del primer debut con el grupo
    private groupId?: string
  ) {
    super(
      id,
      realName,
      birthDate.getAge(),
      entryDate,
      ApprenticeTrainingLevel.AVANZADO,
      ApprenticeStatus.PROCESO_DE_SELECCION,
      agencyId
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
    return this.birthDate.getAge();
  }

  public debut(groupId: string, debutDate: DateValue): void {
    this.groupId = groupId;
    this.transitionDate = debutDate;
    this.statusArtist = ArtistStatus.ACTIVO;
  }
}
