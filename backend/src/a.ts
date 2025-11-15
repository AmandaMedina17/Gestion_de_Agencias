// test-database.ts
import { AppDataSource } from './Config/ormconfig';

async function testDatabase() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Conectado a la base de datos');

    // Verificar tablas
    const tables = await AppDataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('📋 Tablas en la base de datos:');
    tables.forEach((table: any) => {
      console.log(`   - ${table.table_name}`);
    });

    // Verificar específicamente la tabla users
    const usersTableExists = await AppDataSource.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    console.log('👤 Tabla users existe:', usersTableExists[0].exists);

    if (usersTableExists[0].exists) {
      const userCount = await AppDataSource.getRepository('UserOrmEntity').count();
      console.log(`👥 Número de usuarios: ${userCount}`);
    }

    await AppDataSource.destroy();
  } catch (error) {
    console.error('💥 Error:', error);
  }
}

testDatabase();