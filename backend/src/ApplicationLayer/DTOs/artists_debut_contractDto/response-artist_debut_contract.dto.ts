import { ArtistResponseDto } from "../artistDto/response-artist.dto";
import { ContractResponseDto } from "../contractDto/response-contract.dto";
import { GroupResponseDto } from "../groupDto/response-group.dto";

export class ArtistDebutContractResponseDto {
  artist!: ArtistResponseDto;
  debutGroups!: GroupResponseDto[]; // Puede debutar en varios grupos
  activeContracts!: ContractResponseDto[]; // Puede tener múltiples contratos activos
}