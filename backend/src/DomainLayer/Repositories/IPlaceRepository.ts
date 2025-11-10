import { IRepository } from "./IRepository";
import { Place } from "@domain/Entities/Place";

export abstract class IPlaceRepository extends IRepository<Place> {}