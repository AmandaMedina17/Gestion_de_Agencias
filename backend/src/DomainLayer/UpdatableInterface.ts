import { UpdateData } from "./UpdateData";

export interface IUpdatable {
  update(updateDto: UpdateData): void;
}