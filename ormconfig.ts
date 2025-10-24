import { config } from 'dotenv';
import 'tsconfig-paths/register';
import { AppDataSource } from './src/InfraestructureLayer/database/Config/data-source';

// Cargar variables de entorno
config();

// Exportar la MISMA configuración que usa tu app
export default AppDataSource;