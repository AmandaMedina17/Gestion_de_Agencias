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
  
  // Entidades (tus tablas)
  entities: ['src/InfraestructureLayer/database/Entities/*.ts'],
  
  // Migraciones (cambios en estructura)
  migrations: ['src/InfraestructureLayer/database/Migrations/*.ts'],
  

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

// Verificar estado de la conexión
// export const getDatabaseStatus = () => {
//   return {
//     isInitialized: AppDataSource.isInitialized,
//     options: {
//       database: AppDataSource.options.database,
//       host: AppDataSource.options.host
//     }
//   };
// };

// Ejecutar migraciones pendientes
export const runMigrations = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await connectDatabase();
    }
    const migrations = await AppDataSource.runMigrations();
    console.log(`✅ ${migrations.length} migraciones ejecutadas`);
    return migrations;
  } catch (error) {
    console.error('❌ Error ejecutando migraciones:', error);
    throw error;
  }
};

// Revertir última migración
export const revertLastMigration = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await connectDatabase();
    }
    await AppDataSource.undoLastMigration();
    console.log('✅ Última migración revertida');
  } catch (error) {
    console.error('❌ Error revirtiendo migración:', error);
    throw error;
  }
};



// import { DataSource } from 'typeorm';
// import { config } from 'dotenv';

// // Cargar variables de entorno
// config();

// export const AppDataSource = new DataSource({
//   type: 'postgres',
//   host: process.env.DB_HOST || 'localhost',
//   port: parseInt(process.env.DB_PORT || '5432'),
//   username: process.env.DB_USERNAME || 'postgres',
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_NAME || 'kpop_management',
  
//   entities: [
//     'src/Infraestructure Layer/database/Entities/*.ts'
//   ],
  
//   migrations: ['src/Infraestructure Layer/database/Migrations/*.ts'],
  
//   synchronize: true, 
//   logging: true,
// });

// // Función para conectar la base de datos
// export const connectDB = async () => {
//   try {
//     await AppDataSource.initialize();
//     console.log('✅ Conectado a la base de datos');
//     return AppDataSource;
//   } catch (error) {
//     console.error('❌ Error conectando a la BD:', error);
//     throw error;
//   }
// };