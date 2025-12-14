import { BillboardList } from "@domain/Entities/BillboardList";
import { IRepository } from "./IRepository";

export abstract class IBillboardRepository extends IRepository<BillboardList> {}