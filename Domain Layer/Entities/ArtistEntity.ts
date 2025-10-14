import { DateValue } from "../Value Objects/Values";
import { ApprenticeID } from "../Value Objects/IDs";
import { ArtistRole, ArtistStatus } from "../Enums";
import { ApprenticeEntity } from "./ApprenticeEntity";

export class ArtistEntity {
  //algo pa guardar las actividades y pa los cpntratos
  private ColaborationsWithArtist: [ArtistEntity, DateValue][] = [];
  //otro pa los grupos

  constructor(
    private readonly id: ApprenticeID,
    private stageName: string,
    private realName: string,
    private birthDate: DateValue,
    private role: ArtistRole,
    private transitionDate: DateValue,
    private status: ArtistStatus,
    private Apprentice: ApprenticeEntity 
    //aqui falta el grupo
  ) {}

  public static createFromApprentice(
    Apprentice: ApprenticeEntity,
    stageName: string,
    birthDate: DateValue,
    artistRole: ArtistRole,
    transitionDate: DateValue
  ): ArtistEntity {
    return new ArtistEntity(
      Apprentice.getId(),
      stageName,
      Apprentice.getFullName(), // Usa el nombre del aprendiz como realName
      birthDate,
      artistRole,
      transitionDate, // Debut al ser promovido
      ArtistStatus.ACTIVO,
      Apprentice // Referencia al aprendiz original
    );
  }

  //metdo para conflicto de agenda FALTA

  public getId(): ApprenticeID {
    return this.id;
  }

  public getStageName(): string {
    return this.stageName;
  }

  public getRealName(): string {
    return this.realName;
  }

  public getBirthDate(): DateValue {
    return this.birthDate;
  }

  public getRole(): ArtistRole {
    return this.role;
  }

  public getDebutDate(): DateValue {
    return this.transitionDate;
  }

  public getStatus(): ArtistStatus {
    return this.status;
  }

  public getAge(): number {
    return this.birthDate.getAge();
  }

  public addColaborationWithArtist(
    artist: ArtistEntity,
    date: DateValue
  ): void {
    if (!this.ColaborationsWithArtist.includes([artist, date])) {
      this.ColaborationsWithArtist.push([artist, date]);
    }
  }
}
