import { v4 as uuidv4} from 'uuid';
import { ActivityClassification, ActivityType } from "../Enums";

export class ActivityEntity {
    constructor(
        private readonly id : string = uuidv4(),
        private classification: ActivityClassification,
        private type: ActivityType,
    ) {
        this.validate();
    }

    private validate(): void {
        this.validateClassificationType();
    }

    //AGREGAR VALIDACION
    private validateClassificationType(): void {

    }

    // Getters
    public getId(): string {
        return this.id;
    }

    public getClassification(): ActivityClassification {
        return this.classification;
    }

    public getType(): ActivityType {
        return this.type;
    }
}