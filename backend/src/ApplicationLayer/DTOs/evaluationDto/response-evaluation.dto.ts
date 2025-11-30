import { EvaluationValue } from "../../../DomainLayer/Enums";

export class EvaluationResponseDto{
    apprentice!: string;
    date!: Date;
    evaluation!: EvaluationValue;
}