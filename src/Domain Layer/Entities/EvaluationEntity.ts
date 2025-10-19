import { Evaluation } from "../Enums";
import { v4 as uuidv4 } from "uuid";
import { DateValue } from "../Value Objects/Values";

export class EvaluationEntity {
  constructor(
    private readonly id: string = uuidv4(),
    private evaluationDate: DateValue, //esto es con fecha
    private evaluation: Evaluation
  ) {}
}
