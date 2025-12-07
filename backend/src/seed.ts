import { DataSource } from 'typeorm';
import { randomUUID } from "crypto";
import * as bcrypt from 'bcrypt';
import { UserOrmEntity} from './InfraestructureLayer/database/Entities/UserEntity';
import { UserRole } from './DomainLayer/Enums';
import { ApprenticeEntity } from './InfraestructureLayer/database/Entities/ApprenticeEntity';
import { faker } from "@faker-js/faker";
import { ApprenticeStatus, ApprenticeTrainingLevel } from './DomainLayer/Enums';
import { ArtistStatus } from './DomainLayer/Enums';
import { ActivityDateEntity } from './InfraestructureLayer/database/Entities/ActivityDateEntity';
import { ActivityEntity } from './InfraestructureLayer/database/Entities/ActivityEntity';
import { ActivityPlaceEntity } from './InfraestructureLayer/database/Entities/ActivityPlaceEntity';
import { ActivityResponsibleEntity } from './InfraestructureLayer/database/Entities/ActivityResponsibleEntity';
import { AgencyEntity } from './InfraestructureLayer/database/Entities/AgencyEntity';
import { AlbumEntity } from './InfraestructureLayer/database/Entities/AlbumEntity';
import { ApprenticeEvaluationEntity } from './InfraestructureLayer/database/Entities/ApprenticeEvaluationEntity';
import { ArtistActivityEntity } from './InfraestructureLayer/database/Entities/ArtistActivityEntity';
import { ArtistAgencyMembershipEntity } from './InfraestructureLayer/database/Entities/ArtistAgencyMembershipEntity';
import { ArtistCollaborationEntity } from './InfraestructureLayer/database/Entities/ArtistCollaborationEntity';
import { ArtistEntity } from './InfraestructureLayer/database/Entities/ArtistEntity';
import { ArtistGroupCollaborationEntity } from './InfraestructureLayer/database/Entities/ArtistGroupCollaborationEntity';
import { ArtistGroupMembershipEntity } from './InfraestructureLayer/database/Entities/ArtistGroupMembershipEntity';
import { AwardEntity } from './InfraestructureLayer/database/Entities/AwardEntity';
import { BillboardListEntity } from './InfraestructureLayer/database/Entities/BillboardListEntity';
import { ContractEntity } from './InfraestructureLayer/database/Entities/ContractEntity';
import { DateEntity } from './InfraestructureLayer/database/Entities/DateEntity';
import { GroupActivityEntity } from './InfraestructureLayer/database/Entities/GroupActivity';
import { GroupEntity } from './InfraestructureLayer/database/Entities/GroupEntity';
import { IncomeEntity } from './InfraestructureLayer/database/Entities/IncomeEntity';
import { IntervalEntity } from './InfraestructureLayer/database/Entities/IntervalEntity';
import { PlaceEntity } from './InfraestructureLayer/database/Entities/PlaceEntity';
import { ResponsibleEntity } from './InfraestructureLayer/database/Entities/ResponsibleEntity';
import { SongBillboardEntity } from './InfraestructureLayer/database/Entities/SongBillboardEntity';
import { SongEntity } from './InfraestructureLayer/database/Entities/SongEntity';

async function bootstrap() {
  console.log('🚀 Iniciando script de seeding...');

  const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'chulymsoto',
    database: 'kpop_management',
    entities: [
      ActivityDateEntity,
      ActivityEntity,
      ActivityPlaceEntity,
      ActivityResponsibleEntity,
      AgencyEntity,
      AlbumEntity,
      ApprenticeEntity,
      ApprenticeEvaluationEntity,
      ArtistActivityEntity,
      ArtistAgencyMembershipEntity,
      ArtistCollaborationEntity,
      ArtistEntity,
      ArtistGroupCollaborationEntity,
      ArtistGroupMembershipEntity,
      AwardEntity,
      BillboardListEntity,
      ContractEntity,
      DateEntity,
      GroupActivityEntity,
      GroupEntity,
      IncomeEntity,
      IntervalEntity,
      PlaceEntity,
      ResponsibleEntity,
      SongBillboardEntity,
      SongEntity,
      UserOrmEntity
    ],
    synchronize: true,
    logging: true,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Conectado a la base de datos');

    const userRepository = dataSource.getRepository(UserOrmEntity);
    const apprenticeRepo = dataSource.getRepository(ApprenticeEntity);
    const agencyRepo = dataSource.getRepository(AgencyEntity);
    const artistRepo = dataSource.getRepository(ArtistEntity);

    console.log('🏢 Creando 50 agencias...');
    const agencies: Partial<AgencyEntity>[] = [];

    // Nombres de ciudades coreanas para lugares realistas
    const koreanCities = [
      'Seúl', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Suwon', 
      'Ulsan', 'Changwon', 'Goyang', 'Yongin', 'Seongnam', 'Bucheon', 
      'Cheongju', 'Ansan', 'Jeonju', 'Cheonan', 'Namyangju', 'Chuncheon',
      'Gangneung', 'Jeju', 'Pohang', 'Gimhae', 'Mokpo', 'Suncheon', 'Andong'
    ];

    // Nombres de agencias reales y ficticias
    const agencyNames = [
      'SM Entertainment', 'YG Entertainment', 'JYP Entertainment', 'HYBE Corporation',
      'Cube Entertainment', 'FNC Entertainment', 'Starship Entertainment', 'Woollim Entertainment',
      'DSP Media', 'Pledis Entertainment', 'TS Entertainment', 'MBK Entertainment',
      'Fantagio', 'WM Entertainment', 'RBW', 'Source Music', 'Big Hit Music',
      'Cre.ker Entertainment', 'Jellyfish Entertainment', 'Plan A Entertainment',
      'MMO Entertainment', 'Brand New Music', 'Mystic Story', 'KQ Entertainment',
      'Highline Entertainment', 'Amoeba Culture', 'Black Label', 'YGX',
      'EDAM Entertainment', 'IST Entertainment', 'Wake One', 'Modhaus',
      'Attrakt', 'Blockberry Creative', 'DR Music', 'DSP Media', 'Evermore Music',
      'Feel Ghood Music', 'Groovl1n', 'How Entertainment', 'IOK Company',
      'Konnect Entertainment', 'Liveworks Company', 'MLD Entertainment',
      'Music Works', 'Nega Network', 'NH Media', 'P Nation', 'Sidus HQ',
      'Studio J', 'Top Media'
    ];

    for (let i = 0; i < 50; i++) {
      const place = faker.helpers.arrayElement(koreanCities);
      const nameAgency = agencyNames[i] || `${place} Entertainment`;
      
      agencies.push({
        id: randomUUID(),
        place: place,
        dateFundation: faker.date.between({ 
          from: '1990-01-01', 
          to: '2020-12-31' 
        }),
        name: nameAgency,
      });
    }

    await agencyRepo.save(agencies);
    console.log("✅ 50 agencias insertadas correctamente.");

    console.log('🎓 Creando 100 aprendices con agencias asignadas...');
    const apprentices: Partial<ApprenticeEntity>[] = [];

    const agencyIds = agencies.map(agency => agency.id);

    for (let i = 0; i < 100; i++) {
      const randomAgencyId = faker.helpers.arrayElement(agencyIds);
      
      apprentices.push({
        id: randomUUID(), 
        fullName: faker.person.fullName(),
        age: faker.number.int({ min: 16, max: 45 }),
        status: faker.helpers.arrayElement(Object.values(ApprenticeStatus)),
        trainingLevel: faker.helpers.arrayElement(Object.values(ApprenticeTrainingLevel)),
        entryDate: faker.date.past({ years: 2 }),
        agencyId: randomAgencyId, // Asignar agencia aleatoria
      });
    }

    await apprenticeRepo.save(apprentices);
    console.log("✅ 100 aprendices insertados correctamente con agencias asignadas.");

    console.log('🎤 Creando 50 artistas...');
    
    const allApprentices = await apprenticeRepo.find();

    if (allApprentices.length === 0) {
      throw new Error("❌ No hay aprendices en la base de datos.");
    }

    const ARTISTS_TO_CREATE = 50;

    if (ARTISTS_TO_CREATE > allApprentices.length) {
      throw new Error("❌ No hay suficientes aprendices para asignar artistas únicos.");
    }

    const shuffled = faker.helpers.shuffle(allApprentices);
    const selected = shuffled.slice(0, ARTISTS_TO_CREATE);
    const artists: Partial<ArtistEntity>[] = [];

    for (const apprentice of selected) {
      const firstName = apprentice.fullName.trim().split(" ")[0];
      
      artists.push({
        id: randomUUID(),
        apprenticeId: apprentice.id, // id del aprendiz asignado
        stageName: firstName,
        statusArtist: faker.helpers.arrayElement(Object.values(ArtistStatus)),
        birthDate: faker.date.birthdate({ min: 1990, max: 2008, mode: "year" }),
        transitionDate: faker.date.soon({ days: 800 }),
         
      });
    }

    await artistRepo.save(artists);
    console.log(`✅ ${ARTISTS_TO_CREATE} artistas generados sin repetir aprendiz.`);

    console.log('👤 Creando usuarios...');
    
    const users = [
      { username: 'admin', password: '123', role: UserRole.ADMIN },
      { username: 'manager', password: 'manager123', role: UserRole.AGENCY_MANAGER },
      { username: 'artist', password: 'artist123', role: UserRole.ARTIST },
    ];

    let createdCount = 0;
    for (const userData of users) {
      try {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        await userRepository.insert({
          username: userData.username,
          password: hashedPassword,
          role: userData.role,
          isActive: true,
        });
        
        console.log(`✅ ${userData.username} creado exitosamente`);
        createdCount++;
      } catch (error: any) {
        if (error.code === '23505') {
          console.log(`⚠️ ${userData.username} ya existe`);
        } else {
          console.log(`❌ Error con ${userData.username}:`, error.message);
        }
      }
    }

    console.log('\n📊 ESTADÍSTICAS DEL SEEDING:');
    console.log(`🏢 Agencias creadas: ${agencies.length}`);
    console.log(`🎓 Aprendices creados: ${apprentices.length}`);
    console.log(`🎤 Artistas creados: ${artists.length}`);
    console.log(`👤 Usuarios creados/actualizados: ${createdCount}`);
    
    const agencyDistribution = await apprenticeRepo
      .createQueryBuilder('apprentice')
      .select('agency.name', 'name')
      .addSelect('COUNT(apprentice.id)', 'apprenticeCount')
      .innerJoin('agency', 'agency', 'apprentice.agencyId = agency.id')
      .groupBy('agency.name')
      .orderBy('COUNT(apprentice.id)', 'DESC')
      .getRawMany();

    console.log('\n📈 Distribución de aprendices por agencia:');
    agencyDistribution.forEach(agency => {
      console.log(`   ${agency.name}: ${agency.apprenticeCount} aprendices`);
    });

    console.log('\n🎉 Seeding completado exitosamente!');
    
  } catch (error) {
    console.error('💥 Error durante el seeding:', error);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('🔌 Conexión cerrada');
    }
  }
}

bootstrap();