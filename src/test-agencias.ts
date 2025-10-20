import { AppDataSource } from './Infraestructure Layer/database/Entities/config/data-source';
import { AgencyEntity } from './Infraestructure Layer/database/Entities/AgencyEntity';
import { ApprenticeEntity } from './Infraestructure Layer/database/Entities/ApprenticeEntity';
import { ArtistEntity } from './Infraestructure Layer/database/Entities/ArtistEntity';
import { GroupEntity } from './Infraestructure Layer/database/Entities/GroupEntity';
import { AlbumEntity } from './Infraestructure Layer/database/Entities/AlbumEntity';
import { ActivityEntity } from './Infraestructure Layer/database/Entities/ActivityEntity';
import { ActivityDateEntity } from './Infraestructure Layer/database/Entities/Many To Many/ActivityDateEntity';
import { ActivityPlaceEntity } from './Infraestructure Layer/database/Entities/Many To Many/ActivityPlaceEntity';
import { ActivityResponsibleEntity } from './Infraestructure Layer/database/Entities/Many To Many/ActivityResponsibleEntity';
import { ArtistActivityEntity } from './Infraestructure Layer/database/Entities/Many To Many/ArtistActivityEntity';
import { GroupActivityEntity} from './Infraestructure Layer/database/Entities/Many To Many/GroupActivity';
import { ApprenticeEvaluationEntity } from './Infraestructure Layer/database/Entities/Many To Many/ApprenticeEvaluationEntity';
import { ArtistAgencyMembershipEntity } from './Infraestructure Layer/database/Entities/Many To Many/ArtistAgencyMembershipEntity';
import { ArtistCollaborationEntity } from './Infraestructure Layer/database/Entities/Many To Many/ArtistCollaborationEntity';
import { ArtistGroupCollaborationEntity } from './Infraestructure Layer/database/Entities/Many To Many/ArtistGroupCollaborationEntity';
import { ArtistGroupMembershipEntity } from './Infraestructure Layer/database/Entities/Many To Many/ArtistGroupMembershipEntity';
import { ContractEntity } from './Infraestructure Layer/database/Entities/ContractEntity';
import { IntervalEntity } from './Infraestructure Layer/database/Entities/IntervalEntity';
import { BillboardListEntity } from './Infraestructure Layer/database/Entities/BillboardListEntity';
import { SongEntity } from './Infraestructure Layer/database/Entities/SongEntity';
import { EvaluationEntity } from './Infraestructure Layer/database/Entities/EvaluationEntity';

export enum ApprenticeStatus{
    EN_ENTRENAMIENTO = "EN_ENTRENAMIENTO",
    PROCESO_DE_SELECCION = "PROCESO_DE_SELECCION",
    TRANSFERIDO = "TRANSFERIDO"
}

export enum ArtistRole{
    LIDER = "LIDER",
    VOCALISTA = "VOCALISTA", 
    RAPERO = "RAPERO",
    BAILARIN = "BAILARIN",
    VISUAL = "VISUAL",
    MAKNAE = "MAKNAE"
}

export enum ArtistStatus{
    ACTIVO = "ACTIVO",
    EN_PAUSA = "EN_PAUSA",
    INACTIVO = "INACTIVO"
}

export enum Evaluation{
    EXCELENTE = "EXCELENTE",
    BIEN = "BIEN",
    REGULAR = "REGULAR",
    MAL = "MAL",
    INSUFICIENTE = "INSUFICIENTE"
}

export enum ApprenticeTrainingLevel{
    PRINCIPIANTE = "PRINCIPIANTE",
    INTERMEDIO = "INTERMEDIO",
    AVANZADO = "AVANZADO"
}

export enum ActivityType{
    INDIVIDUAL = "INDIVIDUAL",
    GRUPAL = "GRUPAL"
}

export enum ActivityClassification {
    // Training
    VOCAL_CLASS = "VOCAL_CLASS",
    DANCE_CLASS = "DANCE_CLASS",
    RAP_CLASS = "RAP_CLASS",
    PHYSICAL_TRAINING = "PHYSICAL_TRAINING",
    // Performance
    SHOWCASE = "SHOWCASE",
    PRACTICE_CONCERT = "PRACTICE_CONCERT",
    VIDEO_RECORDING = "VIDEO_RECORDING",
    
    // Production
    AUDIO_RECORDING = "AUDIO_RECORDING",
    PHOTO_SHOOT = "PHOTO_SHOOT",
    CHOREOGRAPHY_REHEARSAL = "CHOREOGRAPHY_REHEARSAL",
    
    // Promotion
    INTERVIEW = "INTERVIEW",
    FAN_MEETING = "FAN_MEETING",
    PROMOTIONAL_EVENT = "PROMOTIONAL_EVENT"
}

export enum ContractStatus {
    ACTIVO = "ACTIVO",
    FINALIZADO = "FINALIZADO",
    EN_RENOVACION = "EN_RENOVACION",
    RESCINDIDO = "RESCINDIDO",
}

export enum GroupStatus{
    ACTIVO = "ACTIVO",
    EN_PAUSA= "EN_PAUSA",
    DISUELTO = "DISUELTO"
}
  
export enum BillboardListScope{
    INTERNACIONAL = "INTERNACIONAL",
    NACIONAL = "NACIONAL"
}

async function populateAllTables() {
  try {
    console.log('🚀 Conectando a la base de datos...');
    await AppDataSource.initialize();
    console.log('✅ Conectado a PostgreSQL\n');

    // ==================== 1. AGENCIAS ====================
    console.log('📝 Creando agencias...');
    const agencies = [];
    
    const agency1 = new AgencyEntity();
    agency1.id = "dgdggbdgbnh";
    agency1.place = 'Seúl, Corea del Sur';
    agency1.dateFundation = new Date('1995-02-14');
    agency1.name = 'SM Entertainment';
    agencies.push(await AppDataSource.getRepository(AgencyEntity).save(agency1));

    const agency2 = new AgencyEntity();
    agency2.id = "kugfiavgrieg";
    agency2.place = 'Seúl, Corea del Sur';
    agency2.dateFundation = new Date('2005-02-01');
    agency2.name = 'JYP Entertainment';
    agencies.push(await AppDataSource.getRepository(AgencyEntity).save(agency2));

    const agency3 = new AgencyEntity();
    agency3.id = "jhbfarkfhlaljrf";
    agency3.place = 'Seúl, Corea del Sur';
    agency3.dateFundation = new Date('2011-07-03');
    agency3.name = 'HYBE Corporation';
    agencies.push(await AppDataSource.getRepository(AgencyEntity).save(agency3));

    console.log('✅ Agencias creadas:', agencies.length);

    // ==================== 2. APRENDICES ====================
    console.log('📝 Creando aprendices...');
    const apprentices = [];
    
    const apprentice1 = new ApprenticeEntity();
    apprentice1.id = "jhbskhvbshfbvks";
    apprentice1.fullName = 'Kim Min-ji';
    apprentice1.entryDate = new Date('2023-01-15');
    apprentice1.age = 18;
    apprentice1.status = ApprenticeStatus.EN_ENTRENAMIENTO;
    apprentice1.trainingLevel = ApprenticeTrainingLevel.PRINCIPIANTE;
    apprentice1.agencyId = agencies[0].id;
    apprentices.push(await AppDataSource.getRepository(ApprenticeEntity).save(apprentice1));

    const apprentice2 = new ApprenticeEntity();
    apprentice2.id = "habkuhBEFAKHBDF";
    apprentice2.fullName = 'Lee Soo-hyun';
    apprentice2.entryDate = new Date('2023-02-20');
    apprentice2.age = 17;
    apprentice2.status = ApprenticeStatus.EN_ENTRENAMIENTO;
    apprentice2.trainingLevel = ApprenticeTrainingLevel.PRINCIPIANTE;
    apprentice2.agencyId = agencies[1].id;
    apprentices.push(await AppDataSource.getRepository(ApprenticeEntity).save(apprentice2));

    const apprentice3 = new ApprenticeEntity();
    apprentice3.id = "mfjbsdkfjd";
    apprentice3.fullName = 'Lee';
    apprentice3.entryDate = new Date('2023-02-20');
    apprentice3.age = 19;
    apprentice3.status = ApprenticeStatus.EN_ENTRENAMIENTO;
    apprentice3.trainingLevel = ApprenticeTrainingLevel.PRINCIPIANTE;
    apprentice3.agencyId = agencies[1].id;
    apprentices.push(await AppDataSource.getRepository(ApprenticeEntity).save(apprentice3));

    console.log('✅ Aprendices creados:', apprentices.length);

    // ==================== 3. ARTISTAS ====================
    console.log('📝 Creando artistas...');
    const artists = [];
    
    const artist1 = new ArtistEntity();
    artist1.id = "shjerfiauefhrbfh";
    artist1.apprenticeId = apprentice1;
    artist1.stageName = 'V';
    artist1.statusArtist = ArtistStatus.ACTIVO;
    artist1.birthDate = new Date('1995-12-30');
    artist1.transitionDate = new Date('2013-12-30');
    artists.push(await AppDataSource.getRepository(ArtistEntity).save(artist1));

    const artist2 = new ArtistEntity();
    artist2.id = "dkjfndhfvbjdfvkd";
    artist2.apprenticeId = apprentice2;

    artist2.stageName = 'Jimin';
    artist2.statusArtist = ArtistStatus.ACTIVO;
    artist2.birthDate = new Date('1995-10-13');
    artist2.transitionDate = new Date('2013-12-30');
    artists.push(await AppDataSource.getRepository(ArtistEntity).save(artist2));

    const artist3 = new ArtistEntity();
    artist3.id = "fdfgdfgjshdnajk";
    artist3.apprenticeId = apprentice3;
  
    artist3.stageName = 'Jin';
    artist3.statusArtist = ArtistStatus.ACTIVO;
    artist3.birthDate = new Date('1992-12-04');
    artist3.transitionDate = new Date('2013-12-30');
    artists.push(await AppDataSource.getRepository(ArtistEntity).save(artist3));

    console.log('✅ Artistas creados:', artists.length);

    // ==================== 4. GRUPOS ====================
    console.log('📝 Creando grupos...');
    const groups = [];
    
    const group1 = new GroupEntity();
    group1.id = "dshagdfjavhkfhagefk";
    group1.name = 'BTS';
    group1.status = GroupStatus.ACTIVO;
    group1.concept = 'Hip-Hop, Pop, R&B';
    group1.debutDate = new Date('2013-06-13');
    group1.memberNumber = 7;
    group1.is_created = true;
    group1.agency = agencies[2];
    groups.push(await AppDataSource.getRepository(GroupEntity).save(group1));

    const group2 = new GroupEntity();
    group2.id = "mjdbfkajlff";

    group2.name = 'TWICE';
    group2.status = GroupStatus.ACTIVO;
    group2.concept = 'K-Pop, Dance';
    group2.debutDate = new Date('2015-10-20');
    group2.memberNumber = 9;
    group2.is_created = true;
    group2.agency = agencies[1];
    groups.push(await AppDataSource.getRepository(GroupEntity).save(group2));

    console.log('✅ Grupos creados:', groups.length);

    // ==================== 5. INTERVALOS ====================
    console.log('📝 Creando intervalos...');
    const intervals = [];
    
    const interval1 = new IntervalEntity();
    interval1.id = "akhfkavyfgaluyfuo"
    interval1.startDate = new Date('2024-01-01');
    interval1.endDate = new Date('2024-12-31');
    intervals.push(await AppDataSource.getRepository(IntervalEntity).save(interval1));

    const interval2 = new IntervalEntity();
    interval2.id = "ajbfkagvkfagvkflhb";
    interval2.startDate = new Date('2023-01-01');
    interval2.endDate = new Date('2023-12-31');
    intervals.push(await AppDataSource.getRepository(IntervalEntity).save(interval2));

    console.log('✅ Intervalos creados:', intervals.length);

    // ==================== 6. CONTRATOS ====================
    console.log('📝 Creando contratos...');
    const contracts = [];
    
    const contract1 = new ContractEntity();
    contract1.intervalID = intervals[0].id;
    contract1.agencyID = agencies[2].id;
    contract1.artistID = artists[0].id;
    contract1.status = ContractStatus.ACTIVO;
    contract1.conditions = 'Contrato de representación exclusiva por 1 año';
    contract1.distributionPercentage = 70.0;
    contracts.push(await AppDataSource.getRepository(ContractEntity).save(contract1));

    const contract2 = new ContractEntity();
    contract2.intervalID = intervals[1].id;
    contract2.agencyID = agencies[1].id;
    contract2.artistID = artists[1].id;
    contract2.status = ContractStatus.ACTIVO;
    contract2.conditions = 'Contrato estándar con renovación automática';
    contract2.distributionPercentage = 65.0;
    contracts.push(await AppDataSource.getRepository(ContractEntity).save(contract2));

    console.log('✅ Contratos creados:', contracts.length);

    // ==================== 7. ACTIVIDADES ====================
    console.log('📝 Creando actividades...');
    const activities = [];
    
    const activity1 = new ActivityEntity();
    activity1.id = 'act-001';
    activity1.classification = ActivityClassification.DANCE_CLASS;
    activity1.type = ActivityType.GRUPAL;
    activities.push(await AppDataSource.getRepository(ActivityEntity).save(activity1));

    const activity2 = new ActivityEntity();
    activity2.id = 'act-002';
    activity2.classification = ActivityClassification.VOCAL_CLASS;
    activity2.type = ActivityType.INDIVIDUAL;
    activities.push(await AppDataSource.getRepository(ActivityEntity).save(activity2));

    const activity3 = new ActivityEntity();
    activity3.id = 'act-003';
    activity3.classification = ActivityClassification.PHOTO_SHOOT;
    activity3.type = ActivityType.GRUPAL;
    activities.push(await AppDataSource.getRepository(ActivityEntity).save(activity3));

    console.log('✅ Actividades creadas:', activities.length);

    // // ==================== 8. FECHAS DE ACTIVIDAD ====================
    // console.log('📝 Creando fechas de actividad...');
    // const activityDates = [];
    
    // const activityDate1 = new ActivityDateEntity();
    // activityDate1.dateId = "sjdgfkauhewfkhgef";
    // activityDate1.activity = activities[0];
    // activityDates.push(await AppDataSource.getRepository(ActivityDateEntity).save(activityDate1));

    // const activityDate2 = new ActivityDateEntity();
    // activityDate2.dateId = "ajbdfkdfhladh";

    // activityDate2.activity = activities[1];
    // activityDates.push(await AppDataSource.getRepository(ActivityDateEntity).save(activityDate2));

    // console.log('✅ Fechas de actividad creadas:', activityDates.length);

    // // ==================== 9. LUGARES DE ACTIVIDAD ====================
    // console.log('📝 Creando lugares de actividad...');
    // const activityPlaces = [];
    
    // const activityPlace1 = new ActivityPlaceEntity();
    // activityPlace1.activity = activities[0];
    // activityPlaces.push(await AppDataSource.getRepository(ActivityPlaceEntity).save(activityPlace1));

    // const activityPlace2 = new ActivityPlaceEntity();
    // activityPlace2.activity = activities[1];
    // activityPlaces.push(await AppDataSource.getRepository(ActivityPlaceEntity).save(activityPlace2));

    // console.log('✅ Lugares de actividad creados:', activityPlaces.length);

    // // ==================== 10. RESPONSABLES DE ACTIVIDAD ====================
    // console.log('📝 Creando responsables de actividad...');
    // const activityResponsibles = [];
    
    // const activityResponsible1 = new ActivityResponsibleEntity();
    // activityResponsible1.activity = activities[0];
    // activityResponsible1.responsibleId = 'Kim Entrenador';
    // activityResponsibles.push(await AppDataSource.getRepository(ActivityResponsibleEntity).save(activityResponsible1));

    // const activityResponsible2 = new ActivityResponsibleEntity();
    // activityResponsible2.activity = activities[1];
    // activityResponsible2.responsibleId = 'Park Vocal Coach';
    // activityResponsibles.push(await AppDataSource.getRepository(ActivityResponsibleEntity).save(activityResponsible2));

    // console.log('✅ Responsables de actividad creados:', activityResponsibles.length);

    // ==================== 11. ACTIVIDADES DE ARTISTA ====================
    console.log('📝 Creando actividades de artista...');
    const artistActivities = [];
    
    const artistActivity1 = new ArtistActivityEntity();
    artistActivity1.artistId = artists[0].id;
    artistActivity1.activity = activities[1];
    artistActivities.push(await AppDataSource.getRepository(ArtistActivityEntity).save(artistActivity1));

    const artistActivity2 = new ArtistActivityEntity();
    artistActivity2.artistId = artists[1].id;
    artistActivity2.activity = activities[0];
    artistActivities.push(await AppDataSource.getRepository(ArtistActivityEntity).save(artistActivity2));

    console.log('✅ Actividades de artista creadas:', artistActivities.length);

    // ==================== 12. ACTIVIDADES DE GRUPO ====================
    console.log('📝 Creando actividades de grupo...');
    const groupActivities = [];
    
    const groupActivity1 = new GroupActivityEntity();
    groupActivity1.group = groups[0];
    groupActivity1.activity = activities[2];
    groupActivities.push(await AppDataSource.getRepository(GroupActivityEntity).save(groupActivity1));

    const groupActivity2 = new GroupActivityEntity();
    groupActivity2.group = groups[1];
    groupActivity2.activity = activities[0];
    groupActivities.push(await AppDataSource.getRepository(GroupActivityEntity).save(groupActivity2));

    console.log('✅ Actividades de grupo creadas:', groupActivities.length);

    // // ==================== 13. EVALUACIONES DE APRENDIZ ====================
    // console.log('📝 Creando evaluaciones de aprendiz...');
    // const apprenticeEvaluations = [];

    // const evalucion = new EvaluationEntity();
    // evalucion.id = "Asasas";
    // evalucion.date = new Date('2024-03-02');

    
    // const apprenticeEvaluation1 = new ApprenticeEvaluationEntity();
    // apprenticeEvaluation1.apprenticeId = apprentices[0].id;
    // apprenticeEvaluation1.evaluationId = evalucion.id;
    // apprenticeEvaluations.push(await AppDataSource.getRepository(ApprenticeEvaluationEntity).save(apprenticeEvaluation1));

    // const apprenticeEvaluation2 = new ApprenticeEvaluationEntity();
    // apprenticeEvaluation2.apprenticeId = apprentices[1].id;
    // apprenticeEvaluation2.evaluationId = evalucion.id;
    // apprenticeEvaluations.push(await AppDataSource.getRepository(ApprenticeEvaluationEntity).save(apprenticeEvaluation2));

    // console.log('✅ Evaluaciones de aprendiz creadas:', apprenticeEvaluations.length);


    // ==================== 18. ÁLBUMES ====================
    console.log('📝 Creando álbumes...');
    const albums = [];
    
    const album1 = new AlbumEntity();
    album1.id = 'album-001';
    album1.title = 'Map of the Soul: 7';
    album1.releaseDate = new Date('2020-02-21');
    album1.mainProducer = 'Pdogg';
    album1.copiesSold = 5000000;
    album1.numberOfTracks = 19;
    album1.group = groups[0];
    albums.push(await AppDataSource.getRepository(AlbumEntity).save(album1));

    const album2 = new AlbumEntity();
    album2.id = 'album-002';
    album2.title = 'Eyes Wide Open';
    album2.releaseDate = new Date('2020-10-26');
    album2.mainProducer = 'J.Y. Park';
    album2.copiesSold = 3500000;
    album2.numberOfTracks = 17;
    album2.group = groups[1];
    albums.push(await AppDataSource.getRepository(AlbumEntity).save(album2));

    console.log('✅ Álbumes creados:', albums.length);

    // ==================== 19. LISTAS BILLBOARD ====================
    console.log('📝 Creando listas Billboard...');
    const billboardLists = [];
    
    const billboardList1 = new BillboardListEntity();
    billboardList1.name = 'Billboard Hot 100';
    billboardList1.entryDate = new Date('2024-03-01');
    billboardLists.push(await AppDataSource.getRepository(BillboardListEntity).save(billboardList1));

    const billboardList2 = new BillboardListEntity();
    billboardList2.name = 'Billboard Global 200';
    billboardList2.entryDate = new Date('2024-03-01');
    billboardLists.push(await AppDataSource.getRepository(BillboardListEntity).save(billboardList2));

    console.log('✅ Listas Billboard creadas:', billboardLists.length);

    // ==================== 20. CANCIONES ====================
    console.log('📝 Creando canciones...');
    const songs = [];
    
    const song1 = new SongEntity();
    song1.name = 'Dynamite';
    song1.entryDate = new Date('2020-08-21');
    song1.album = albums[0];
    songs.push(await AppDataSource.getRepository(SongEntity).save(song1));

    const song2 = new SongEntity();
    song2.name = 'Butter';
  
    song2.entryDate = new Date('2021-05-21');
    song2.album = albums[0];
    songs.push(await AppDataSource.getRepository(SongEntity).save(song2));

    console.log('✅ Canciones creadas:', songs.length);

    // ==================== RESUMEN FINAL ====================
    console.log('\n🎉 ¡TODAS LAS TABLAS HAN SIDO POBLADAS EXITOSAMENTE!');
    console.log('===========================================');
    
    const tableCounts = await Promise.all([
      AppDataSource.getRepository(AgencyEntity).count(),
      AppDataSource.getRepository(ApprenticeEntity).count(),
      AppDataSource.getRepository(ArtistEntity).count(),
      AppDataSource.getRepository(GroupEntity).count(),
      AppDataSource.getRepository(AlbumEntity).count(),
      AppDataSource.getRepository(ActivityEntity).count(),
      AppDataSource.getRepository(ActivityDateEntity).count(),
      AppDataSource.getRepository(ActivityPlaceEntity).count(),
      AppDataSource.getRepository(ActivityResponsibleEntity).count(),
      AppDataSource.getRepository(ArtistActivityEntity).count(),
      AppDataSource.getRepository(GroupActivityEntity).count(),
      AppDataSource.getRepository(ApprenticeEvaluationEntity).count(),
      AppDataSource.getRepository(ArtistAgencyMembershipEntity).count(),
      AppDataSource.getRepository(ArtistCollaborationEntity).count(),
      AppDataSource.getRepository(ArtistGroupCollaborationEntity).count(),
      AppDataSource.getRepository(ArtistGroupMembershipEntity).count(),
      AppDataSource.getRepository(ContractEntity).count(),
      AppDataSource.getRepository(IntervalEntity).count(),
      AppDataSource.getRepository(BillboardListEntity).count(),
      AppDataSource.getRepository(SongEntity).count()
    ]);

    const tableNames = [
      'Agencias', 'Aprendices', 'Artistas', 'Grupos', 'Álbumes',
      'Actividades', 'Fechas Actividad', 'Lugares Actividad', 'Responsables Actividad',
      'Actividades Artista', 'Actividades Grupo', 'Evaluaciones Aprendiz',
      'Membresías Artista-Agencia', 'Colaboraciones Artistas', 'Colaboraciones Artista-Grupo',
      'Membresías Artista-Grupo', 'Contratos', 'Intervalos', 'Listas Billboard', 'Canciones'
    ];

    console.log('\n📊 RESUMEN DE DATOS INSERTADOS:');
    console.log('===========================================');
    tableNames.forEach((name, index) => {
      console.log(`   ${name}: ${tableCounts[index]}`);
    });

  } catch (error: any) {
    console.log('❌ Error:', error.message);
    if (error.stack) {
      console.log('Stack:', error.stack.split('\n').slice(0, 3).join('\n'));
    }
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('\n🔚 Conexión cerrada');
    }
  }
}

// Ejecutar el script
populateAllTables();