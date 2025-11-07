// src/app.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth.module";
import { UserOrmEntity } from "../InfraestructureLayer/database/Entities/UserEntity";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "amsasc17",
      database: "kpop_management",
      entities: [UserOrmEntity],
      synchronize: true, // Solo en desarrollo
      logging: true,
    }),
    AuthModule,
  ],
})
export class AppModule {}
