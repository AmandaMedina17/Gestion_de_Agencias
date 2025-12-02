export abstract class IRepository<T> {   
  abstract findById(id: string): Promise<T | null>;
  abstract findAll(): Promise<T[]>;
  abstract save(entity: T): Promise<T>;
  abstract update(entity: T): Promise<T>;
  abstract delete(id: string): Promise<void>;
}
//Se deberia por cuestiones este'ticas Renombrar esta clase a IBasicCruds

