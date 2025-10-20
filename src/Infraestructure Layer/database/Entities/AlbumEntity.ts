
import { Entity, PrimaryColumn, Column , ManyToOne, JoinColumn, OneToMany} from 'typeorm';
import { GroupEntity } from './GroupEntity';
import { ArtistEntity } from './ArtistEntity';
import { AwardEntity } from './AwardEntity';
import { SongEntity } from './SongEntity';

@Entity()
export class AlbumEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  title!: string;

  @Column()
  releaseDate!: Date;

  @Column()
  mainProducer!: string;

  @Column()
  copiesSold!: number;

  @Column()
  numberOfTracks!: number;

  // Un álbum puede pertenecer a 0 o 1 grupo
  @ManyToOne(() => GroupEntity, (group: GroupEntity) => group.albums, {
    nullable: true, // Permite que sea null (álbum sin grupo)
    onDelete: "SET NULL", // Si se elimina el grupo, el álbum queda sin grupo
  })
  @JoinColumn({ name: "group_id" })
  group?: GroupEntity; // Hacer la propiedad opcional

  // Columna para la clave foránea
  @Column({ name: "group_id", nullable: true }) // nullable: true permite álbumes sin grupo
  groupId?: string;

  // Un álbum puede pertenecer a 0 o 1 artista
  @ManyToOne(() => ArtistEntity, (artist: ArtistEntity) => artist.albums, {
    nullable: true,
    onDelete: 'SET NULL'
  })
  @JoinColumn({ name: 'artist_id' })
  artist?: ArtistEntity ;

  @Column({ name: "artist_id", nullable: true })
  artistId!: string;

  // Un álbum puede recibir 0 o muchos premios
  @OneToMany(() => AwardEntity, (award: AwardEntity) => award.album)
  awards!: AwardEntity[];

  @OneToMany(() => SongEntity, (song) => song.album) 
  songs!: SongEntity[];

}
