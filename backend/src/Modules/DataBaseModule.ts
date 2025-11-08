// src/Database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {AppDataSource} from 'src/Config/ormconfig'

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options as any), 
  ],
})
export class DatabaseModule {}

