import { CreateArtistDto } from '../../../backend/src/ApplicationLayer/DTOs/artistDto/create-artist.dto';
import { ArtistResponseDto } from './dtos/ArtistDto';
import { ArtistStatus } from '../../../backend/src/DomainLayer/Enums';

const API_BASE_URL = 'http://localhost:3000'; // Puerto del backend NestJS

export const artistService = {
  // Crear un nuevo artista
  async create(createArtistDto: CreateArtistDto): Promise<ArtistResponseDto> {
    try {
      const response = await fetch(`${API_BASE_URL}/artist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createArtistDto),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error.: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating artist:', error);
      throw error;
    }
  },

  // Obtener todos los aprendices
  async findAll(): Promise<ArtistResponseDto[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/artist`);
      if (!response.ok) {
        throw new Error(`Error.: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching artists:', error);
      throw error;
    }
  },

  // Obtener un artista por ID
  async findOne(id: string): Promise<ArtistResponseDto> {
    try {
      const response = await fetch(`${API_BASE_URL}/artist/${id}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching artist:', error);
      throw error;
    }
  },

  // Eliminar un artista
  async remove(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/artist/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting artist:', error);
      throw error;
    }
  },

   // Actualizar un artista
  async update(id: string, updateArtistDto: { transitionDate:Date, status: ArtistStatus, stageName: string, birthday: Date, groupId: string}): Promise<ArtistResponseDto> {
    try {
      const response = await fetch(`${API_BASE_URL}/artist/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateArtistDto),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating artist:', error);
      throw error;
    }
  },
};