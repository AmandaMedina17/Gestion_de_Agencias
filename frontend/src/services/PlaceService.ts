import { CreatePlaceDto } from '../../../backend/src/ApplicationLayer/DTOs/placeDto/create-place.dto';
import { PlaceResponseDto } from './dtos/PlaceDto';

const API_BASE_URL = 'http://localhost:3000'; 

export const placeService = {
  async create(createPlaceDto: CreatePlaceDto): Promise<PlaceResponseDto> {
    try {
      const response = await fetch(`${API_BASE_URL}/place`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createPlaceDto),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating place:', error);
      throw error;
    }
  },

  // Obtener todos los places
  async findAll(): Promise<PlaceResponseDto[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/place`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching places:', error);
      throw error;
    }
  },

  // Obtener un place por ID
  async findOne(id: string): Promise<PlaceResponseDto> {
    try {
      const response = await fetch(`${API_BASE_URL}/place/${id}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching place:', error);
      throw error;
    }
  },

  // Eliminar un place
  async remove(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/place/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting place:', error);
      throw error;
    }
  },

   // Actualizar un place
  async update(id: string, updatePlaceDto: { name: string }): Promise<PlaceResponseDto> {
    try {
      const response = await fetch(`${API_BASE_URL}/place/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePlaceDto),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating place:', error);
      throw error;
    }
  },
};