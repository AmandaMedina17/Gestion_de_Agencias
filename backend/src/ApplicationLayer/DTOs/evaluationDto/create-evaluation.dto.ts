import { EvaluationValue } from "../../../DomainLayer/Enums";

export class CreateEvaluationDto{
    apprentice!: string;
    date!: Date;
    evaluation!: EvaluationValue;
}