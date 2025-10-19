// Infraestructure Layer/Entities/config/data-source.ts
import { DataSource } from 'typeorm';
import { AgencyEntity } from '../AgencyEntity';
import { ApprenticeEntity } from '../ApprenticeEntity';
import { ArtistEntity } from '../ArtistEntity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password', 
  database: 'kpop_management',
  entities: [
    AgencyEntity,
    ApprenticeEntity, 
    ArtistEntity
  ],
  synchronize: true,
  logging: true,
});