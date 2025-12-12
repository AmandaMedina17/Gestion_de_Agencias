import { Injectable, Inject } from '@nestjs/common';
import { IApprenticeRepository } from '@domain/Repositories/IApprenticeRepository';
import { IArtistRepository } from '@domain/Repositories/IArtistRepository';
import { CreateArtistDto } from '@application/DTOs/artistDto/create-artist.dto';
import { Artist } from '@domain/Entities/Artist';
import { ArtistStatus } from '@domain/Enums';
import { Apprentice } from '@domain/Entities/Apprentice';

@Injectable()
export class CreateArtistUseCase {
  constructor(
    @Inject(IApprenticeRepository)
    private readonly apprenticeRepository: IApprenticeRepository,
    @Inject(IArtistRepository)
    private readonly artistRepository: IArtistRepository,
  ) {}

  async execute(createArtistDto: CreateArtistDto): Promise<Artist> {
    const {transitionDate, stageName, birthday, apprenticeId} = createArtistDto;

    // 1. Validar que el aprendiz exista
    const apprentice = await this.apprenticeRepository.findById(apprenticeId);
    if (!apprentice) {
      throw new Error('Apprentice not found');
    }

    //Validar que el aprendiz no tenga ya un artista asociado
    const existingArtist = await this.findArtistByApprenticeId(apprenticeId);
    if (existingArtist) {
      throw new Error('This apprentice is already associated with an artist');
    }

    //Validar que la fecha de nacimiento coincida con la edad del aprendiz
    this.validateBirthDateMatchesApprenticeAge(birthday, apprentice);

    //Crear el artista
    const artist = Artist.create(
      transitionDate,
      ArtistStatus.ACTIVO, 
      stageName,
      birthday,
      apprenticeId,
    );

    // Guardar el artista
    return await this.artistRepository.save(artist);
  }

  // Método auxiliar para buscar artista por apprenticeId
  private async findArtistByApprenticeId(apprenticeId: string): Promise<Artist | null> {
    const allArtists = await this.artistRepository.findAll();
    return allArtists.find(artist => artist.getApprenticeId() === apprenticeId) || null;
  }

  // Validar que la fecha de nacimiento coincida con la edad del aprendiz
  private validateBirthDateMatchesApprenticeAge(birthDate: Date, apprentice: Apprentice): void {
    // Calcular la edad a partir de la fecha de nacimiento
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    
    // Ajustar si el cumpleaños aún no ha ocurrido este año
    const hasHadBirthdayThisYear = 
      (today.getMonth() > birthDate.getMonth()) || 
      (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
    
    if (!hasHadBirthdayThisYear) {
      calculatedAge--;
    }

    // Obtener la edad del aprendiz
    const apprenticeAge = apprentice.getAge();

    // Comparar las edades (permitir un margen de diferencia de ±1 año por posibles discrepancias)
    if (Math.abs(calculatedAge - apprenticeAge) > 1) {
      throw new Error(`Artist birth date (age ${calculatedAge}) does not match apprentice age (${apprenticeAge})`);
    }
  }
}