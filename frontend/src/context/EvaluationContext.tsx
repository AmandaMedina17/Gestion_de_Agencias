import React, { createContext, useContext, useState, ReactNode } from 'react';
import { apprenticeEvaluationService } from '../services/EvaluationService';
import {CreateEvaluationDto} from"../../../backend/src/ApplicationLayer/DTOs/evaluationDto/create-evaluation.dto"
import {EvaluationResponseDto} from"../../../backend/src/ApplicationLayer/DTOs/evaluationDto/response-evaluation.dto"
import {UpdateEvaluationDto} from"../../../backend/src/ApplicationLayer/DTOs/evaluationDto/update-evaluation.dto"

interface ApprenticeEvaluationContextType {
  // Estado
  evaluations: EvaluationResponseDto[];
  loading: boolean;
  error: string | null;

  // Acciones
  createEvaluation: (createDto: CreateEvaluationDto) => Promise<void>;
  fetchEvaluations: () => Promise<void>;
  fetchEvaluation: (apprenticeId: string, dateId: Date) => Promise<EvaluationResponseDto | null>;
  deleteEvaluation: (apprenticeId: string, dateId: Date) => Promise<void>;
  updateEvaluation: (apprenticeId: string, dateId: Date, updateData: UpdateEvaluationDto) => Promise<void>;
  fetchByApprenticeId: (apprenticeId: string) => Promise<EvaluationResponseDto[]>;
  fetchByDateId: (dateId: Date) => Promise<EvaluationResponseDto[]>;
  clearError: () => void;
}

const ApprenticeEvaluationContext = createContext<ApprenticeEvaluationContextType | undefined>(undefined);

export const useApprenticeEvaluation = () => {
  const context = useContext(ApprenticeEvaluationContext);
  if (!context) {
    throw new Error('useApprenticeEvaluation must be used within a ApprenticeEvaluationProvider');
  }
  return context;
};

export const ApprenticeEvaluationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [evaluations, setEvaluations] = useState<EvaluationResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEvaluation = async (createDto: CreateEvaluationDto) => {
    setLoading(true);
    setError(null);
    try {
      const newEvaluation = await apprenticeEvaluationService.create(createDto);
      setEvaluations(prev => [...prev, newEvaluation]);
    } catch (err: any) {
      setError(err.message || 'Error al crear evaluación');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchEvaluations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apprenticeEvaluationService.findAll();
      setEvaluations(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar evaluaciones');
    } finally {
      setLoading(false);
    }
  };

  const fetchEvaluation = async (apprenticeId: string, dateId: Date): Promise<EvaluationResponseDto | null> => {
    setLoading(true);
    setError(null);
    try {
      return await apprenticeEvaluationService.findOne(apprenticeId, dateId);
    } catch (err: any) {
      setError(err.message || 'Error al cargar evaluación');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteEvaluation = async (apprenticeId: string, dateId: Date) => {
    setLoading(true);
    setError(null);
    try {
      await apprenticeEvaluationService.remove(apprenticeId, dateId);
      setEvaluations(prev => prev.filter(evaluation => 
        !(evaluation.apprentice === apprenticeId && evaluation.date === dateId)
      ));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar evaluación');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEvaluation = async (apprenticeId: string, dateId: Date, updateData: UpdateEvaluationDto) => {
    setLoading(true);
    setError(null);
    console.log("context");
    console.log(apprenticeId);
    console.log(dateId);
    console.log(updateData.evaluation);

    
    try {
      
      await apprenticeEvaluationService.update(apprenticeId, dateId, updateData);
      await fetchEvaluations(); // Recargar la lista
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la evaluación');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchByApprenticeId = async (apprenticeId: string): Promise<EvaluationResponseDto[]> => {
    setLoading(true);
    setError(null);
    try {
      return await apprenticeEvaluationService.findByApprenticeId(apprenticeId);
    } catch (err: any) {
      setError(err.message || 'Error al cargar evaluaciones por aprendiz');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchByDateId = async (dateId: Date): Promise<EvaluationResponseDto[]> => {
    setLoading(true);
    setError(null);
    try {
      return await apprenticeEvaluationService.findByDateId(dateId);
    } catch (err: any) {
      setError(err.message || 'Error al cargar evaluaciones por fecha');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <ApprenticeEvaluationContext.Provider value={{
      evaluations,
      loading,
      error,
      createEvaluation,
      fetchEvaluations,
      fetchEvaluation,
      deleteEvaluation,
      updateEvaluation,
      fetchByApprenticeId,
      fetchByDateId,
      clearError,
    }}>
      {children}
    </ApprenticeEvaluationContext.Provider>
  );
};