export interface IRepository<T, TId> {
  findById(id: TId): Promise<T>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  delete(id: TId): Promise<void>;
}
