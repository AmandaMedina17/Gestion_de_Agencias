import { config } from 'dotenv';
config();

export const databaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kpop_management',
};

if (!databaseConfig.password) {
  throw new Error('❌ DB_PASSWORD is required in .env file');
}

if (databaseConfig.port < 1 || databaseConfig.port > 65535) {
  throw new Error('❌ DB_PORT must be between 1-65535');
}