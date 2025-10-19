import { ActivityClassification, ActivityType } from "../Enums";

export class Activity {
    constructor(
        private readonly id : string,
        private classification: ActivityClassification,
        private type: ActivityType,
    ){
        this.validate();
    }

    private validate(): void {
        if (!this.id || this.id.trim() === '') {
            throw new Error('ID cannot be null or empty');
        }

        if (this.classification === null || this.classification === undefined) {
            throw new Error('Classification cannot be null');
        }

        if (this.type === null || this.type === undefined) {
            throw new Error('Type cannot be null');
        }
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