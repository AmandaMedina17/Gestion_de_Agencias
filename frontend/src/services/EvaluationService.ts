import {CreateEvaluationDto} from"../../../backend/src/ApplicationLayer/DTOs/evaluationDto/create-evaluation.dto"
import {EvaluationResponseDto} from"../../../backend/src/ApplicationLayer/DTOs/evaluationDto/response-evaluation.dto"
import {UpdateEvaluationDto} from"../../../backend/src/ApplicationLayer/DTOs/evaluationDto/update-evaluation.dto"

export class ApprenticeEvaluationService {
  private baseUrl = "http://localhost:3000/apprentice-evaluations";

  // En tu ApprenticeEvaluationService.ts - método create
  async create(createDto: CreateEvaluationDto): Promise<EvaluationResponseDto> {
    console.log('Enviando datos al backend:', createDto);
    
    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apprentice: createDto.apprentice,
        date: createDto.date.toISOString().split('T')[0], // Formato YYYY-MM-DD
        evaluation: createDto.evaluation,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Error del backend:', errorData);
      throw new Error(errorData.message || `Error: ${res.status}`);
    }
    return res.json();
  }

  async findAll(): Promise<EvaluationResponseDto[]> {
    const res = await fetch(this.baseUrl);
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return res.json();
  }

  async findByApprenticeId(apprenticeId: string): Promise<EvaluationResponseDto[]> {
    const res = await fetch(`${this.baseUrl}/apprentice/${apprenticeId}`);
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return res.json();
  }

  async findByDateId(dateId: Date): Promise<EvaluationResponseDto[]> {
    const res = await fetch(`${this.baseUrl}/date/${dateId}`);
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return res.json();
  }

  async findOne(apprenticeId: string, dateId: Date): Promise<EvaluationResponseDto> {
    const res = await fetch(`${this.baseUrl}/${apprenticeId}/${dateId}`);
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return res.json();
  }

  async update(
    apprenticeId: string, 
    dateId: Date, 
    updateDto: UpdateEvaluationDto
  ): Promise<EvaluationResponseDto> {
    
    console.log("service");
    console.log(apprenticeId);
    console.log(dateId);
    console.log(updateDto.evaluation);

    const encodedDateId = encodeURIComponent(dateId.toString());

    console.log(encodedDateId);

    const res = await fetch(`${this.baseUrl}/${apprenticeId}/${encodedDateId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateDto),
    });

    if (!res.ok) throw new Error((await res.json()).message);
    return res.json();
  }

  async remove(apprenticeId: string, dateId: Date): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${apprenticeId}/${dateId}`, { 
      method: "DELETE" 
    });
    if (!res.ok) throw new Error(`Error: ${res.status}`);
  }
}

export const apprenticeEvaluationService = new ApprenticeEvaluationService();