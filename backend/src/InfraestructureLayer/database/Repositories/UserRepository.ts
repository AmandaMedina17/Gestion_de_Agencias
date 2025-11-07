// user.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrmEntity } from '../Entities/UserEntity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: Repository<UserOrmEntity>,
  ) {}

  async findByUsername(username: string): Promise<UserOrmEntity | null> {
    return this.userRepository.findOne({
      where: { username: username, isActive: true }
    });
  }

  async createUser(userData: Partial<UserOrmEntity>): Promise<UserOrmEntity> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async findById(id: string): Promise<UserOrmEntity | null> {
    return this.userRepository.findOne({ where: { id: id } });
  }
}