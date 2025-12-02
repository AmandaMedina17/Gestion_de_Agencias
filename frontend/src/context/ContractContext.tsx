import React, { createContext, useContext, useState, ReactNode } from 'react';
import { contractService } from '../services/ContractService';
import { CreateContractDto } from '../../../backend/src/ApplicationLayer/DTOs/contractDto/create-contract.dto';
import { ContractResponseDto } from '../../../backend/src/ApplicationLayer/DTOs/contractDto/response-contract.dto';
import { ContractStatus } from '../../../backend/src/DomainLayer/Enums';

interface ContractContextType {
  // Estado
  contracts: ContractResponseDto[];
  loading: boolean;
  error: string | null;

  // Acciones
  createContract: (createDto: CreateContractDto) => Promise<void>;
  fetchContracts: () => Promise<void>;
  fetchContract: (id: string) => Promise<ContractResponseDto | null>;
  deleteContract: (id: string) => Promise<void>;
  updateContract: (id: string,  updateData: { 
    startDate: Date; 
    endDate: Date; 
    agencyId: string; 
    artistId: string; 
    distributionPercentage: number; 
    status: ContractStatus; 
    conditions: string; 
  }) => Promise<void>;
  clearError: () => void;
}

interface ContractProviderProps {
  children: ReactNode;
}

const ContractContext = createContext<ContractContextType | undefined>(undefined);

export const useContract = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error('useContract must be used within a ContractProvider');
  }
  return context;
};

export const ContractProvider: React.FC<ContractProviderProps> = ({ children }) => {
  const [contracts, setContracts] = useState<ContractResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createContract = async (createDto: CreateContractDto) => {
    setLoading(true);
    setError(null);
    try {
      const newContract = await contractService.create(createDto);
      setContracts(prev => [...prev, newContract]);
    } catch (err: any) {
      setError(err.message || 'Error al crear contrato');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchContracts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await contractService.findAll();
      setContracts(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar contratos');
    } finally {
      setLoading(false);
    }
  };

  const fetchContract = async (id: string): Promise<ContractResponseDto | null> => {
    setLoading(true);
    setError(null);
    try {
      return await contractService.findOne(id);
    } catch (err: any) {
      setError(err.message || 'Error al cargar contrato');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteContract = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await contractService.remove(id);
      setContracts(prev => prev.filter(contract => contract.id !== id));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar contrato');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateContract = async (id: string,  updateData: { 
    startDate: Date; 
    endDate: Date; 
    agencyId: string; 
    artistId: string; 
    distributionPercentage: number; 
    status: ContractStatus; 
    conditions: string; 
  }) => {
    setLoading(true);
    setError(null);
    try {
      await contractService.update(id, updateData);
      await fetchContracts(); // Recargar la lista
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el contrato');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <ContractContext.Provider value={{
      contracts,
      loading,
      error,
      createContract,
      fetchContracts,
      fetchContract,
      deleteContract,
      updateContract,
      clearError,
    }}>
      {children}
    </ContractContext.Provider>
  );
};