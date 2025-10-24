import 'tsconfig-paths/register';
import 'reflect-metadata';
import { connectDatabase } from './InfraestructureLayer/database/Config/data-source'

const startApp = async () => {
  try {
    // 1. Conectar BD
    await connectDatabase();
    
    // 2. Tu aplicación aquí
    console.log('🚀 App funcionando en desarrollo');
    
  } catch (error) {
    console.error('💥 Error iniciando app:', error);
  }
};

startApp();