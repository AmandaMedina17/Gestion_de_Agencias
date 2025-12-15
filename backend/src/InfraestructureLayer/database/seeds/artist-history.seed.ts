import { DataSource } from 'typeorm';

export async function seedArtistHistory(dataSource: DataSource) {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // 1. Crear Place (requerido por agency)
    await queryRunner.query(`
        INSERT INTO "place_entity" (id, place)
        VALUES ('place-1', 'Seúl, Corea del Sur')
        ON CONFLICT (id) DO NOTHING;
      `);

    // 2. Crear Agencia
    await queryRunner.query(`
      INSERT INTO agency (id, name, date_fundation, place_id)
      VALUES ('agency-1', 'Big Hit Entertainment', '2005-02-01', 'place-1')
      ON CONFLICT (id) DO NOTHING;
    `);

    // 3. Crear Billboard Lists
    await queryRunner.query(`
      INSERT INTO "billboardList" (id, name, public_date, scope, end_list)
      VALUES 
        ('billboard-1', 'Billboard Hot 100', '2023-01-01', 'INTERNACIONAL', 100),
        ('billboard-2', 'Gaon Chart', '2023-01-01', 'NACIONAL', 100)
      ON CONFLICT (id) DO NOTHING;
    `);

    // 4. Crear aprendices (requeridos por artistas)
    await queryRunner.query(`
        INSERT INTO apprentice (id, full_name, entry_date, age, status, "trainingLevel", agency_id)
        VALUES 
          ('apprentice-1', 'Harry Edward Styles Training', '2009-01-01', 15, 'TRANSFERIDO', 'AVANZADO', 'agency-1'),
          ('apprentice-2', 'Zain Javadd Malik Training', '2009-01-01', 16, 'TRANSFERIDO', 'AVANZADO', 'agency-1')
        ON CONFLICT (id) DO NOTHING;
      `);

    // 5. Crear Grupo DISUELTO
    await queryRunner.query(`
      INSERT INTO "group" (id, name, num_members, status, "debutDate", is_created, concept, agency_id)
      VALUES ('group-1', 'One Direction', 5, 'DISUELTO', '2010-07-23', true, 'Pop', 'agency-1')
      ON CONFLICT (id) DO NOTHING;
    `);

    // 6. Crear Artistas
    await queryRunner.query(`
      INSERT INTO artist (id, stage_name, status, birth_date, transition_date, apprentice_id)
      VALUES 
        ('artist-1', 'Harry Styles', 'ACTIVO', '1994-02-01', '2010-07-23', 'apprentice-1'),
        ('artist-2', 'Zayn Malik', 'ACTIVO', '1993-01-12', '2010-07-23', 'apprentice-2')
      ON CONFLICT (id) DO NOTHING;
    `);

    // 7. Membresías artista-agencia
    await queryRunner.query(`
      INSERT INTO artist_agency_membership (artist_id, agency_id, "startDate")
      VALUES 
        ('artist-1', 'agency-1', '2010-07-23'),
        ('artist-2', 'agency-1', '2010-07-23')
      ON CONFLICT (artist_id, agency_id, "startDate") DO NOTHING;
    `);

    // 8. Membresías en el grupo
    await queryRunner.query(`
      INSERT INTO artist_group_membership (artist_id, group_id, "startDate", end_date, rol, fecha_debut_art)
      VALUES 
        ('artist-1', 'group-1', '2010-07-23', '2016-01-01', 'Vocalista', '2010-07-23'),
        ('artist-2', 'group-1', '2010-07-23', '2015-03-25', 'Vocalista', '2010-07-23')
      ON CONFLICT (artist_id, group_id, "startDate") DO NOTHING;
    `);

    // 9. Crear Álbum con +1M copias
    await queryRunner.query(`
      INSERT INTO "album_entity" (id, title, "releaseDate", "mainProducer", "copiesSold", group_id)
      VALUES ('album-1', 'Take Me Home', '2012-11-09', 'Julian Bunetta', 1500000, 'group-1')
      ON CONFLICT (id) DO NOTHING;
    `);

    // 10. Crear Canciones
    await queryRunner.query(`
      INSERT INTO song (id, name, entry_date, album_id)
      VALUES ('song-1', 'Live While We are Young', '2012-11-09', 'album-1')
      ON CONFLICT (id) DO NOTHING;
    `);

    // 11. Entrada en Billboard (año siguiente: 2013)
    await queryRunner.query(`
        INSERT INTO song_billboard (song_id, billboard_list_id, entry_date, place)
        VALUES ('song-1', 'billboard-1', '2013-02-15', 15)
        ON CONFLICT (song_id, billboard_list_id) DO NOTHING;
      `);

    // 12. Crear Contratos
    await queryRunner.query(`
      INSERT INTO contract_entity (contract_id, "agencyID", "artistID", "startDate", end_date, status, conditions, "distributionPercentage")
      VALUES 
        ('contract-1', 'agency-1', 'artist-1', '2010-07-23', '2016-01-01', 'FINALIZADO', 'Contrato inicial', 50.00),
        ('contract-2', 'agency-1', 'artist-1', '2016-05-01', '2025-12-31', 'ACTIVO', 'Contrato solista', 70.00)
      ON CONFLICT (contract_id, "agencyID", "artistID", "startDate") DO NOTHING;
    `);

    await queryRunner.commitTransaction();
    console.log('✅ Seed completado exitosamente');
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('❌ Error en seed:', error);
    throw error;
  } finally {
    await queryRunner.release();
  }
}