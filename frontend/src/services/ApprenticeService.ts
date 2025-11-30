import { CreateApprenticeDto } from '../../../backend/src/ApplicationLayer/DTOs/apprenticeDto/create-apprentice.dto';
import { ApprenticeResponseDto } from './dtos/ApprenticeDto';
import { BaseService } from "./BaseService";
import { ApprenticeResponseDto } from '../../../backend/src/ApplicationLayer/DTOs/apprenticeDto/response-apprentice.dto';
import { CreateApprenticeDto } from '../../../backend/src/ApplicationLayer/DTOs/apprenticeDto/create-apprentice.dto';

const API_BASE_URL = 'http://localhost:3000'; // Puerto del backend NestJS

export const apprenticeService = {
  // Crear un nuevo aprendiz
  async create(createApprenticeDto: CreateApprenticeDto): Promise<ApprenticeResponseDto> {
    try {
      const response = await fetch(`${API_BASE_URL}/apprentices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createApprenticeDto),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error.: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating apprentice:', error);
      throw error;
    }
  },

  // Obtener todos los aprendices
  async findAll(): Promise<ApprenticeResponseDto[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/apprentices`);
      if (!response.ok) {
        throw new Error(`Error.: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching apprentices:', error);
      throw error;
    }
  },

  // Obtener un aprendiz por ID
  async findOne(id: string): Promise<ApprenticeResponseDto> {
    try {
      const response = await fetch(`${API_BASE_URL}/apprentices/${id}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching apprentice:', error);
      throw error;
    }
  },

  // Eliminar un aprendiz
  async remove(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/apprentices/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting apprentice:', error);
      throw error;
    }
  },

   // Actualizar un aprendiz
  async update(id: string, updateApprenticeDto: { name: string }): Promise<ApprenticeResponseDto> {
    try {
      const response = await fetch(`${API_BASE_URL}/apprentices/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateApprenticeDto),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating apprentice:', error);
      throw error;
    }
  },
};