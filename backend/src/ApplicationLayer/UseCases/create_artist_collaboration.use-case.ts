import { IContractRepository } from "@domain/Repositories/IContractRepository";
import { IAgencyRepository } from "@domain/Repositories/IAgencyRepository";
import { IArtistRepository } from "@domain/Repositories/IArtistRepository";
import { Inject, Injectable } from "@nestjs/common";
import { CreateArtistCollaborationDto } from "@application/DTOs/artistCollaborationsDto/create-artist-collaboration.dto";


@Injectable()
export class CreateArtistCollaborationUseCase {
  constructor(
   @Inject(IArtistRepository)
    private artistRepository: IArtistRepository
  ) {}

    async execute(createArtistCollaborationDto: CreateArtistCollaborationDto) {
      const { artist1Id, artist2Id, date } = createArtistCollaborationDto;
      
      // Validar que los artistas sean diferentes
      if (artist1Id === artist2Id) {
        throw new Error('Un artista no puede colaborar consigo mismo');
      }
  
      const artist1 = await this.artistRepository.findById(artist1Id);
      const artist2 = await this.artistRepository.findById(artist2Id);
  
      if(!artist1 || !artist2){
          throw new Error("Artist or group not found");
      }
      else{
          if(artist1.getBirthDate() > date || artist2.getBirthDate() > date){
          throw new Error("A collaboration can be before artist birthday");
          }
          if(artist1.getDebutDate() > date || artist2.getDebutDate() > date){
              throw new Error("A collaboration can be before artist debut");
          }
      }
  
      // Ordenar los IDs para evitar duplicados
      const [firstId, secondId] = [artist1Id, artist2Id].sort();
      
      await this.artistRepository.createArtistCollaboration(firstId, secondId, date);

      return {artist1,artist2,date};
    }
}
