import { Entity, PrimaryColumn, Column } from 'typeorm';
import { AlbumEntity } from './AlbumEntity';

@Entity()
export class AwardEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'date' })
  date!: Date;

  @ManyToOne(() => AlbumEntity, (album: AlbumEntity) => album.awards, { 
    nullable: false, // Un premio debe tener un álbum (no puede ser null)
    onDelete: 'CASCADE' // Si se elimina el álbum, se eliminan sus premios
  })
  @JoinColumn({ name: 'album_id' })
  album!: AlbumEntity;

  // Columna para la clave foránea
  @Column({ name: 'album_id' })
  albumId!: string;
}