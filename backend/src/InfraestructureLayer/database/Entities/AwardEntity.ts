import { Entity, PrimaryColumn, Column, ManyToMany, JoinColumn, ManyToOne } from 'typeorm';
import { AlbumEntity } from './AlbumEntity';

@Entity()
export class AwardEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'date' })
  date!: Date;

  @Column({nullable : true})
  albumId?: string 

  @ManyToOne(() => AlbumEntity, (album: AlbumEntity) => album.awards, { 
    nullable: false, 
    onDelete : 'SET NULL'
  })
  @JoinColumn({ name: 'album_id' })
  album!: AlbumEntity[];
}
