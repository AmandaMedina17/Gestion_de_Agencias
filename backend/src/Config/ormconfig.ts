import { DataSource } from 'typeorm';
import 'tsconfig-paths/register';
import { databaseConfig } from './environment';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: databaseConfig.host,
  port: databaseConfig.port,
  username: databaseConfig.username,
  password: databaseConfig.password,
  database: databaseConfig.database,
  
  // Entidades 
  entities: [
  // Desarrollo
  './InfraestructureLayer/database/Entities/*.ts',
  // Produccion
  'dist/InfraestructureLayer/database/Entities/*.js'
],

  migrations: [
  // Desarrollo
  './InfraestructureLayer/database/Migrations/*.ts',
  // Produccion
  'dist/InfraestructureLayer/database/Migrations/*.js'
],
  
  synchronize: false,
  
  // Logs de SQL (útil en desarrollo)
  logging: true //process.env.NODE_ENV === 'development',
});

// Función para conectar la BD
export const connectDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected');
    return AppDataSource;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

// Función para CERRAR la conexión
export const closeDatabase = async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    console.log('✅ Database connection closed');
  }
};
