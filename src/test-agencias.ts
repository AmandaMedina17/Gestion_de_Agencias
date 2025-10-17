// src/test-agencias-corregido.ts
import { AppDataSource } from './Infraestructure Layer/Entities/config/data-source';
import { AgencyEntity } from './Infraestructure Layer/Entities/AgencyEntity';
import { ApprenticeEntity } from './Infraestructure Layer/Entities/ApprenticeEntity';
import { ArtistEntity } from './Infraestructure Layer/Entities/ArtistEntity';

async function testAgenciesAndRelations() {
  try {
    console.log('🚀 Conectando a PostgreSQL...');
    await AppDataSource.initialize();
    console.log('✅ Conectado a la base de datos\n');

    // 1. Crear una agencia
    const agency = new AgencyEntity();
    agency.place = 'Corea del Sur';
    agency.dateFundation = new Date('1995-02-14');
    agency.name = "SM Entertainment";

    const savedAgency = await AppDataSource.getRepository(AgencyEntity).save(agency);
    console.log('✅ Agencia creada:', savedAgency.name);

    // 2. Crear un aprendiz
    const apprentice = new ApprenticeEntity();
    apprentice.fullName = 'Kim Min-jeong';
    apprentice.entryDate = new Date('2020-01-15');
    apprentice.age = 23;
    apprentice.status = 'EN_ENTRENAMIENTO';
    apprentice.trainingLevel = 'PRINCIPIANTE';
    apprentice.agencyId = savedAgency.id;

    const savedApprentice = await AppDataSource.getRepository(ApprenticeEntity).save(apprentice);
    console.log('✅ Aprendiz creado:', savedApprentice.fullName);

    // 3. Crear un artista
    const artist = new ArtistEntity();
    artist.fullName = 'Karina Yu';
    artist.entryDate = new Date('2016-01-01');
    artist.age = 24;
    artist.status = 'EN_ENTRENAMIENTO';
    artist.trainingLevel = 'AVANZADO';
    artist.agencyId = savedAgency.id;
    artist.stageName = 'Karina';
    artist.statusArtist = 'ACTIVO';
    artist.birthDate = new Date('2000-04-11');
    artist.transitionDate = new Date('2020-11-17');

    const savedArtist = await AppDataSource.getRepository(ArtistEntity).save(artist);
    console.log('✅ Artista creado:', savedArtist.stageName);

    // 4. Verificar relaciones
    const agencyWithApprentices = await AppDataSource.getRepository(AgencyEntity)
      .createQueryBuilder('agency')
      .leftJoinAndSelect('agency.apprentices', 'apprentices')
      .where('agency.id = :id', { id: savedAgency.id })
      .getOne();

    console.log('\n📊 Relaciones de la agencia:');
    console.log('   Agencia:', agencyWithApprentices?.name);
    console.log('   Aprendices/Artistas asociados:', agencyWithApprentices?.apprentices?.length || 0);

    if (agencyWithApprentices?.apprentices) {
      agencyWithApprentices.apprentices.forEach(person => {
        if (person instanceof ArtistEntity) {
          console.log('     - Artista:', (person as ArtistEntity).stageName);
        } else {
          console.log('     - Aprendiz:', person.fullName);
        }
      });
    }

  } catch (error: any) {
    console.log('❌ Error:', error.message);
    console.log('Stack:', error.stack);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('\n🔚 Conexión cerrada');
    }
  }
}

testAgenciesAndRelations();