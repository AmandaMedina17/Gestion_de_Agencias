import {Evaluation} from "../Enums";
import { EvaluationID } from "../ValueObjects";
import { DateValue } from "../ValueObjects";

export class EvaluationEntity{
    constructor(
        private readonly id: EvaluationID,
        private evaluationDate: DateValue, //esto es con fecha
        private evaluation: Evaluation

    )
    {
        
    }
}