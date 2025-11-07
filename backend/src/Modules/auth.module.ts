import { Module } from "@nestjs/common";
import { AuthController } from "../ApplicationLayer/controllers/auth.controller";
import { AuthService } from "../ApplicationLayer/services/auth.service";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "../InfraestructureLayer/strategies/local_strategy";
import { JwtStrategy } from "../InfraestructureLayer/strategies/jwt_strategy";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserOrmEntity } from "../InfraestructureLayer/database/Entities/UserEntity";
import { UserRepository } from "../InfraestructureLayer/database/Repositories/UserRepository";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity]),
    PassportModule,
    JwtModule.register({
      secret: "abc123",
      signOptions: { expiresIn: "30m" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, UserRepository],
})
export class AuthModule {}
