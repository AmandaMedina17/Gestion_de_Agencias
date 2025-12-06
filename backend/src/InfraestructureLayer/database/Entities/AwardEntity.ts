import { Entity, PrimaryColumn, Column, ManyToMany, JoinColumn } from 'typeorm';
import { AlbumEntity } from './AlbumEntity';

@Entity()
export class AwardEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'date' })
  date!: Date;

  @ManyToMany(() => AlbumEntity, (album: AlbumEntity) => album.awards, { 
    nullable: false, // Un premio debe tener un álbum (no puede ser null)
    cascade : true 
  })
  @JoinColumn({ name: 'album_id' })
  album!: AlbumEntity[];

  // Columna para la clave foránea
  @Column({ name: 'album_id' })
  albumId!: string;
}


//aqui mis dudas con premio, preguntar a Amando como va a ser la cosa 
//entre premio y album si es muchos a muchos o es many to one 
