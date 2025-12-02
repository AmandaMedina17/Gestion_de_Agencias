import React, { createContext, useContext, useState, ReactNode } from 'react';
import { incomeService } from '../services/IncomeService';
import { CreateIncomeDto } from '../../../backend/src/ApplicationLayer/DTOs/incomeDto/create-income.dto';
import { IncomeResponseDto } from '../../../backend/src/ApplicationLayer/DTOs/incomeDto/response-income.dto';
import { IncomeType } from '../../../backend/src/DomainLayer/Enums';

interface IncomeContextType {
  // Estado
  incomes: IncomeResponseDto[];
  loading: boolean;
  error: string | null;

  // Acciones
  createIncome: (createDto: CreateIncomeDto) => Promise<void>;
  fetchIncomes: () => Promise<void>;
  fetchIncome: (id: string) => Promise<IncomeResponseDto | null>;
  deleteIncome: (id: string) => Promise<void>;
  updateIncome: (id: string, updateData: { 
    type: IncomeType, 
    mount: number, 
    date: Date, 
    responsible: string, 
    activityId: string 
  }) => Promise<void>;
  clearError: () => void;
}

interface IncomeProviderProps {
  children: ReactNode;
}

const IncomeContext = createContext<IncomeContextType | undefined>(undefined);

export const useIncome = () => {
  const context = useContext(IncomeContext);
  if (!context) {
    throw new Error('useIncome must be used within a IncomeProvider');
  }
  return context;
};

export const IncomeProvider: React.FC<IncomeProviderProps> = ({ children }) => {
  const [incomes, setIncomes] = useState<IncomeResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createIncome = async (createDto: CreateIncomeDto) => {
    setLoading(true);
    setError(null);
    try {
      const newIncome = await incomeService.create(createDto);
      setIncomes(prev => [...prev, newIncome]);
    } catch (err: any) {
      setError(err.message || 'Error al crear ingreso');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchIncomes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await incomeService.findAll();
      setIncomes(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar ingresos');
    } finally {
      setLoading(false);
    }
  };

  const fetchIncome = async (id: string): Promise<IncomeResponseDto | null> => {
    setLoading(true);
    setError(null);
    try {
      return await incomeService.findOne(id);
    } catch (err: any) {
      setError(err.message || 'Error al cargar ingreso');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteIncome = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await incomeService.remove(id);
      setIncomes(prev => prev.filter(income => income.id !== id));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar ingreso');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateIncome = async (id: string, updateData: { 
    type: IncomeType, 
    mount: number, 
    date: Date, 
    responsible: string, 
    activityId: string 
  }) => {
    setLoading(true);
    setError(null);
    try {
      await incomeService.update(id, updateData);
      await fetchIncomes(); // Recargar la lista
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el ingreso');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <IncomeContext.Provider value={{
      incomes,
      loading,
      error,
      createIncome,
      fetchIncomes,
      fetchIncome,
      deleteIncome,
      updateIncome,
      clearError,
    }}>
      {children}
    </IncomeContext.Provider>
  );
};