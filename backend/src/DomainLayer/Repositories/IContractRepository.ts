import { Contract } from "../Entities/Contract";
import { IRepository } from "./IRepository";

export abstract class IContractRepository extends IRepository<Contract> {
    abstract getArtistContracts(artistId: string) : Promise<Contract[]>
}