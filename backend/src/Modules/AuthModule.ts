// src/infrastructure/modules/auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '../../presentation/controllers/auth.controller';
import { UserRepositoryImpl } from '../adapters/user.repository.impl';
import { UserOrmEntity } from '../persistence/user.orm-entity';
import { BcryptPasswordHasher } from '../security/bcrypt-password-hasher';
import { LoginUseCase } from '../../application/use-cases/login.usecase';
import { JwtStrategy } from '../security/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SECRET_KEY',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    UserRepositoryImpl,
    BcryptPasswordHasher,
    LoginUseCase,
    JwtStrategy,
  ],
})
export class AuthModule {}
