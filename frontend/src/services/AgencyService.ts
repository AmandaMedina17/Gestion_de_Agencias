import { CreateAgencyDto, AgencyResponseDto } from "./dtos/AgencyDto";

const API_BASE_URL = 'http://localhost:3000'; // Puerto del backend NestJS

export const agencyService = {
  // Crear un nuevo responsable
  async create(createAgencyDto: CreateAgencyDto): Promise<AgencyResponseDto> {
    try {
      const response = await fetch(`${API_BASE_URL}/agency`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createAgencyDto),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating agency:', error);
      throw error;
    }
  },

  // Obtener todos los responsables
  async findAll(): Promise<AgencyResponseDto[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/agency`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching agencys:', error);
      throw error;
    }
  },

  // Obtener un responsable por ID
  async findOne(id: string): Promise<AgencyResponseDto> {
    try {
      const response = await fetch(`${API_BASE_URL}/agency/${id}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching agency:', error);
      throw error;
    }
  },

  // Eliminar un responsable
  async remove(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/agency/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting agency:', error);
      throw error;
    }
  }
};