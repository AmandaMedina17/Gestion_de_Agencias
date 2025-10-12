import { ApprenticeID } from "../ValueObjects";
import { ArtistRole } from "../Enums";
import { ArtistStatus } from "../Enums";
import { DateValue } from "../ValueObjects";
import { ApprenticeEntity } from "./ApprenticeEntity";

export class ArtistEntity{
    //algo pa guardar las actividades y pa los cpntratos

    constructor(
        private readonly id: ApprenticeID,
        private stageName: string,
        private realName: string,
        private birthDate: DateValue,
        private role: ArtistRole,
        private transitionDate: DateValue,
        private status: ArtistStatus,
        private Apprentice: ApprenticeEntity
        //aqui falta el grupo, la agencia
    )
    {

    }

    public static createFromApprentice(Apprentice: ApprenticeEntity, 
                                        stageName: string, 
                                        birthDate: DateValue,
                                        artistRole: ArtistRole,
                                        transitionDate: DateValue): ArtistEntity{
                
        return new ArtistEntity(
            Apprentice.getId(),
            stageName,
            Apprentice.getFullName(), // Usa el nombre del trainee como realName
            birthDate,
            artistRole,
            transitionDate, // Debut al ser promovido
            ArtistStatus.ACTIVO,
            Apprentice // Referencia al aprendiz original
            
        );
    }

    //metdo para conflicto de agenda


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
}