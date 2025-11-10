import { CreateResponsibleDto, ResponsibleResponseDto } from '../../../backend/src/ApplicationLayer/DTOs/ResponsibleDto/create-responsible.dto';

const API_BASE_URL = 'http://localhost:3000'; // Puerto del backend NestJS

export const responsibleService = {
  // Crear un nuevo responsable
  async create(createResponsibleDto: CreateResponsibleDto): Promise<ResponsibleResponseDto> {
    try {
      const response = await fetch(`${API_BASE_URL}/responsible`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createResponsibleDto),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating responsible:', error);
      throw error;
    }
  },

  // Obtener todos los responsables
  async findAll(): Promise<ResponsibleResponseDto[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/responsible`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching responsibles:', error);
      throw error;
    }
  },

  // Obtener un responsable por ID
  async findOne(id: string): Promise<ResponsibleResponseDto> {
    try {
      const response = await fetch(`${API_BASE_URL}/responsible/${id}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching responsible:', error);
      throw error;
    }
  },

  // Eliminar un responsable
  async remove(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/responsible/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting responsible:', error);
      throw error;
    }
  }
};