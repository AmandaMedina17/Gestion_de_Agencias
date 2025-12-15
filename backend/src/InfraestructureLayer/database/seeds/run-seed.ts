import { DataSource } from 'typeorm';
import { seedArtistHistory } from './artist-history.seed';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'kpop_agency',
  synchronize: false,
});

async function runSeeds() {
  try {
    await AppDataSource.initialize();
    console.log('📦 Iniciando seeds...');
    
    await seedArtistHistory(AppDataSource);
    
    console.log('✅ Todos los seeds ejecutados correctamente');
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error ejecutando seeds:', error);
    await AppDataSource.destroy();
    process.exit(1);
  }
}

runSeeds();