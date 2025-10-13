import { ActivityID } from "../ValueObjects";
import { ActivityClassification, ActivityType} from "../Enums";

export class ActividadEntity {
    constructor(
        private readonly id: ActivityID,
        private classification: ActivityClassification,
        private type: ActivityType,
    ) {
        this.validate();
    }

    private validate(): void {

    }

    // Getters
    public getId(): ActivityID {
        return this.id;
    }

    public getClassification(): ActivityClassification {
        return this.classification;
    }

    public getType(): ActivityType {
        return this.type;
    }
}
