import { IArtistHistoryRepository } from "@domain/Repositories/IArtistHistoryRepository";
import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

@Injectable()
export class ArtistHistoryRepository implements IArtistHistoryRepository {
  constructor(
  @InjectDataSource()
  private readonly dataSource: DataSource
  ) {}

  async getQualifiedArtistsIds(): Promise<string[]> {
  const query = `
    WITH DissolvedGroupsWithMillionSales AS (
      SELECT DISTINCT g.id as group_id
      FROM "group" g
      INNER JOIN album_entity a ON a.group_id = g.id
      WHERE g.status = 'DISUELTO'
        AND a."copiesSold" > 1000000
    ),
    GroupsWithBillboardHits AS (
      SELECT DISTINCT a.group_id
      FROM album_entity a
      INNER JOIN song s ON s.album_id = a.id
      INNER JOIN song_billboard sb ON sb.song_id = s.id
      WHERE a.group_id IN (SELECT group_id FROM DissolvedGroupsWithMillionSales)
        AND sb.place <= 100
        AND EXTRACT(YEAR FROM sb.entry_date) = EXTRACT(YEAR FROM a."releaseDate") + 1
    ),
    QualifiedArtists AS (
      SELECT DISTINCT agm.artist_id
      FROM artist_group_membership agm
      WHERE agm.group_id IN (SELECT group_id FROM GroupsWithBillboardHits)
    )
    SELECT 
      a.id as artist_id,
      a.stage_name,
      a.status as artist_status,
      a.birth_date,
      a.transition_date
    FROM QualifiedArtists qa
    INNER JOIN artist a ON a.id = qa.artist_id
    ORDER BY a.stage_name;
  `;
      const results = await this.dataSource.query(query);
      return results.map((row: any) => row.artist_id);
  }
}