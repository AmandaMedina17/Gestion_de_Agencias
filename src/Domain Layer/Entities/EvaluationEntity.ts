import { Evaluation } from "../Enums";
import { EvaluationID } from "../Value Objects/IDs";
import { DateValue } from "../Value Objects/Values";

export class EvaluationEntity {
  constructor(
    private readonly id: EvaluationID,
    private evaluationDate: DateValue, //esto es con fecha
    private evaluation: Evaluation
  ) {}
}
