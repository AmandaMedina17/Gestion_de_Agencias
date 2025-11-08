import { EvaluationValue } from "@domain/Enums";
import { v4 as uuidv4 } from 'uuid';

export class Evaluation {
  constructor(
    private readonly id: string,
    private evaluationDate: Date, //esto es con fecha
    private evaluation: EvaluationValue
  ) {}

  public create(evaluationDate: Date, evaluation: EvaluationValue) : Evaluation {
    const id = uuidv4();
    return new Evaluation( id, evaluationDate, evaluation);
  }

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
