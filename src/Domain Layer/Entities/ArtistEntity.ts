import { DateValue } from "../Value Objects/Values";
import { ApprenticeStatus, ApprenticeTrainingLevel } from "../Enums";
import { ApprenticeID, GroupID, AgencyID} from "../Value Objects/IDs";
import { ArtistRole, ArtistStatus } from "../Enums";
import { ApprenticeEntity } from "./ApprenticeEntity";
import { GroupEntity } from "./GroupEntity";
import { IntervalEntity } from "./IntervalEntity";
import { AgencyEntity } from "./AgencyEntity";

export class ArtistEntity extends ApprenticeEntity{
  constructor(
    id: ApprenticeID,
    entryDate: DateValue,
    agency: AgencyID,
    private statusArtist: ArtistStatus,
    private stageName: string,
    private realName: string,
    private birthDate: DateValue,
    private transitionDate: DateValue | null, //fecha del primer debut con el grupo
    private Group?: GroupID
  ) {super(
    id,
    realName,
    birthDate.getAge(),
    entryDate,
    ApprenticeTrainingLevel.AVANZADO,
    ApprenticeStatus.PROCESO_DE_SELECCION,
    agency
  )

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
    if(this.transitionDate) return this.transitionDate;
    else throw new Error("No ha debutado");
    
  }

  public getStatusArtist(): ArtistStatus {
    return this.statusArtist;
  }

  public getAge(): number {
    return this.birthDate.getAge();
  }

  public debut(groupId: GroupID, debutDate: DateValue): void {
    this.Group = groupId;
    this.transitionDate = debutDate;
    this.statusArtist = ArtistStatus.ACTIVO;
  }

}
