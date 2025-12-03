import { BillboardList } from "@domain/Entities/BillboardList";
import { IRepository } from "./IRepository";

export interface IBillboardRepository extends IRepository<BillboardList> {}

export const BILLBOARD_LIST_REPOSITORY = Symbol('IBillboardRepository');