import { ActivityID } from "../Value Objects/IDs";
import { ActivityClassification, ActivityType } from "../Enums";

export class ActivityEntity {
    constructor(
        private readonly id: ActivityID,
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


    //DUDA
    public changeClassification(newClassification: ActivityClassification): void {
        const previousClassification = this.classification;
        this.classification = newClassification;
        
        try {
            this.validateClassificationType();
        } catch (error) {
            this.classification = previousClassification;
            throw new Error(`Cannot change to ${newClassification} because current type is not compatible`);
        }
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