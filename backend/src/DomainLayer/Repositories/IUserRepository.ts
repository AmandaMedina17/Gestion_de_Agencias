import { User } from '../Entities/User';
import { IRepository } from './IRepository';

export interface UserRepository extends IRepository<User>{
  findByUsername(username: string): Promise<User | null>;
}
