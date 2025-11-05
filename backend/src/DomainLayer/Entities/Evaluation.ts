import { EvaluationValue } from "@domain/Enums";

export class Evaluation {
  constructor(
    private readonly id: string,
    private evaluationDate: Date, //esto es con fecha
    private evaluation: EvaluationValue
  ) {}

  public getId():string
  {
    return this.id;
  }

  public getDate():Date
  {
    return this.evaluationDate;
  }

  public getEvaluation():EvaluationValue
  {
    return this.evaluation;
  }
}
