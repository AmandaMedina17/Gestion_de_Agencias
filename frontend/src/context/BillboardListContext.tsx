import React, { createContext, useContext, useState, ReactNode } from 'react';
import { billboardService } from '../services/BillboardListService';
import { CreateBillBoardListDto } from '../../../backend/src/ApplicationLayer/DTOs/billboardDto/create.billboard.dto';
import { ResponseBillboardListDto } from '../../../backend/src/ApplicationLayer/DTOs/billboardDto/response.billboard.dto';
import { BillboardListScope } from '../../../backend/src/DomainLayer/Enums';

interface BillboardListContextType {
  // Estado
  billboardLists: ResponseBillboardListDto[];
  loading: boolean;
  error: string | null;

  // Acciones
  createBillboardList: (createDto: CreateBillBoardListDto) => Promise<void>;
  fetchBillboardLists: () => Promise<void>;
  fetchBillboardList: (id: string) => Promise<ResponseBillboardListDto | null>;
  deleteBillboardList: (id: string) => Promise<void>;
  updateBillboardList: (id: string, updateData: { 
    publicDate: Date; 
    scope: BillboardListScope; 
    nameList: string; 
    endList: number;
  }) => Promise<void>;
  clearError: () => void;
}

interface BillboardListProviderProps {
  children: ReactNode;
}

const BillboardListContext = createContext<BillboardListContextType | undefined>(undefined);

export const useBillboardList = () => {
  const context = useContext(BillboardListContext);
  if (!context) {
    throw new Error('useBillboardList must be used within a BillboardListProvider');
  }
  return context;
};

export const BillboardListProvider: React.FC<BillboardListProviderProps> = ({ children }) => {
  const [billboardLists, setBillboardLists] = useState<ResponseBillboardListDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBillboardList = async (createDto: CreateBillBoardListDto) => {
    setLoading(true);
    setError(null);
    try {
      const newBillboardList = await billboardService.create(createDto);
      setBillboardLists(prev => [...prev, newBillboardList]);
    } catch (err: any) {
      setError(err.message || 'Error al crear lista Billboard');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchBillboardLists = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await billboardService.findAll();
      setBillboardLists(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar listas Billboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchBillboardList = async (id: string): Promise<ResponseBillboardListDto | null> => {
    setLoading(true);
    setError(null);
    try {
      return await billboardService.findOne(id);
    } catch (err: any) {
      setError(err.message || 'Error al cargar lista Billboard');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteBillboardList = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await billboardService.remove(id);
      setBillboardLists(prev => prev.filter(list => list.id !== id));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar lista Billboard');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBillboardList = async (id: string, updateData: { 
    publicDate: Date; 
    scope: BillboardListScope; 
    nameList: string; 
    endList: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      await billboardService.update(id, updateData);
      await fetchBillboardLists(); // Recargar la lista
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la lista Billboard');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <BillboardListContext.Provider value={{
      billboardLists,
      loading,
      error,
      createBillboardList,
      fetchBillboardLists,
      fetchBillboardList,
      deleteBillboardList,
      updateBillboardList,
      clearError,
    }}>
      {children}
    </BillboardListContext.Provider>
  );
};