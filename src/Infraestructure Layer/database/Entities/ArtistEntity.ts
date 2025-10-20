import { ChildEntity, Column, OneToMany } from 'typeorm';
import { ApprenticeEntity } from './ApprenticeEntity';
import { ArtistStatus } from 'src/Domain Layer/Enums';
import { ArtistActivityEntity } from './Many To Many/ArtistActivityEntity';
import { AlbumEntity } from './AlbumEntity';
import { GroupEntity } from './GroupEntity';
import { ArtistGroupMembershipEntity } from './Many To Many/ArtistGroupMembershipEntity';
import { ArtistCollaborationEntity } from './Many To Many/ArtistCollaborationEntity';
import { ArtistGroupCollaborationEntity } from './Many To Many/ArtistGroupCollaborationEntity';
import { ArtistAgencyMembershipEntity } from './Many To Many/ArtistAgencyMembershipEntity';

@ChildEntity({ name: 'artist'})
    export class ArtistEntity extends ApprenticeEntity{
        @Column({ name: 'stage_name' })
        stageName!: string;

        @Column({
        type: 'enum',
        enum: ArtistStatus
        })
        statusArtist!: string;

        @Column({ name: 'birth_date' })
        birthDate!: Date;

        
        @Column({ name: 'transition_date' })
        transitionDate!: Date;

        // Un artista puede realizar cero o muchas actividades
        @OneToMany(() => ArtistActivityEntity, (artistActivity: ArtistActivityEntity) => artistActivity.artist)
        artistActivities!: ArtistActivityEntity[];

         // Un artista puede tener cero o muchos álbumes
        @OneToMany(() => AlbumEntity, (album: AlbumEntity) => album.artist)
        albums!: AlbumEntity[];

        // Un artista puede proponer cero o muchos grupos
        @OneToMany(() => GroupEntity, (group: GroupEntity) => group.proposedByArtist)
        proposedGroups!: GroupEntity[];
    
        //Relación con las membresías en grupos
        @OneToMany(() => ArtistGroupMembershipEntity, (membership: ArtistGroupMembershipEntity) => membership.artist)
        groupMemberships!: ArtistGroupMembershipEntity[];
    
         //Colaboraciones donde el artista es el primero (artist1)
        @OneToMany(() => ArtistCollaborationEntity, (collaboration: ArtistCollaborationEntity) => collaboration.artist1)
        collaborationsAsArtist1!: ArtistCollaborationEntity[];

        //Colaboraciones donde el artista es el segundo (artist2)
        @OneToMany(() => ArtistCollaborationEntity, (collaboration: ArtistCollaborationEntity) => collaboration.artist2)
        collaborationsAsArtist2!: ArtistCollaborationEntity[];
    
        //Colaboraciones con grupos
        @OneToMany(() => ArtistGroupCollaborationEntity, (collaboration: ArtistGroupCollaborationEntity) => collaboration.artist)
        groupCollaborations!: ArtistGroupCollaborationEntity[];

        // Membresías en agencias
        @OneToMany(() => ArtistAgencyMembershipEntity, (membership: ArtistAgencyMembershipEntity) => membership.artist)
        agencyMemberships!: ArtistAgencyMembershipEntity[];
    
    }  


