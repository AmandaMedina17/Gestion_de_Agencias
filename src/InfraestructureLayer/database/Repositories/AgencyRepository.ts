import { IAgencyRepository } from '@domain/Repositories/IAgencyRepository';
import { Agency } from '@domain/Entities/Agency';
import { Apprentice } from '@domain/Entities/Apprentice';
import { Artist } from '@domain/Entities/Artist';
import { Group } from '@domain/Entities/Group';
import { AgencyMapper } from '../Mappers/AgencyMapper';
import { ApprenticeMapper } from '../Mappers/ApprenticeMapper';
import { ArtistMapper } from '../Mappers/ArtistMapper';
import { GroupMapper } from '../Mappers/GroupMapper';
import { AgencyEntity } from '../Entities/AgencyEntity';
import { ApprenticeEntity } from '../Entities/ApprenticeEntity';
import { ArtistAgencyMembershipEntity } from '../Entities/ArtistAgencyMembershipEntity';
import { GroupEntity } from '../Entities/GroupEntity';
import { ArtistStatus } from '@domain/Enums';
import { AppDataSource } from "src/";

class AgencyRepository implements IAgencyRepository{
    private agencyRepository = AppDataSource.getRepository(AgencyEntity);
    private agencyMapper = new AgencyMapper();
    private apprenticeMapper = new ApprenticeMapper();
    private artistMapper = new ArtistMapper();
    private groupMapper = new GroupMapper();

    async findByName(name: string): Promise<Agency> {
        const agencyEntity = await this.agencyRepository.findOne({
        where: { name },
        relations: ['apprentices', 'groups', 'artistMemberships']
        });

        if (!agencyEntity) {
        throw new Error('Agency not found');
        }

        return this.agencyMapper.toDomainEntity(agencyEntity);
    }


    async getAgencyGroups(id: string): Promise<Group[]> {
        const agencyEntity = await this.agencyRepository.findOne({
        where: { id },
        relations: ['groups']
        });

        if (!agencyEntity) {
        throw new Error('Agency not found');
        }

        return agencyEntity.groups.map((groupEntity : GroupEntity) => 
        this.groupMapper.toDomainEntity(groupEntity)
        );
        
    }
    async getAgencyApprentices(id: string): Promise<Apprentice[]> {
        const agencyEntity = await this.agencyRepository.findOne({
        where: { id },
        relations: ['apprentices']
        });

        if (!agencyEntity) {
        throw new Error('Agency not found');
        }

        return agencyEntity.apprentices.map((apprenticeEntity: ApprenticeEntity) => 
        this.apprenticeMapper.toDomainEntity(apprenticeEntity)
        );
    }
    
    async getAgencyArtists(id: string): Promise<Artist[]> {
        const agencyEntity = await this.agencyRepository.findOne({
        where: { id },
        relations: ['artistMemberships', 'artistMemberships.artist']
        });

        if (!agencyEntity) {
        throw new Error('Agency not found');
        }

        return agencyEntity.artistMemberships.map((membership: ArtistAgencyMembershipEntity) => 
        this.artistMapper.toDomainEntity(membership.artist)
        );
    }
    
    async findActiveArtistsByAgency(agencyId: string): Promise<Artist[]> {
        const agencyEntity = await this.agencyRepository.findOne({
            where: { id: agencyId },
            relations: ['artistMemberships', 'artistMemberships.artist']
        });

        if (!agencyEntity) {
            throw new Error('Agency not found');
        }

        const activeMemberships = agencyEntity.artistMemberships.filter(
            (membership: ArtistAgencyMembershipEntity) => 
                membership.artist && 
                membership.artist.statusArtist === ArtistStatus.ACTIVO // Usando el enum
        );

        return activeMemberships.map((membership:ArtistAgencyMembershipEntity) => 
            this.artistMapper.toDomainEntity(membership.artist)
        );
    }

    async findById(id: string): Promise<Agency> {
        const agencyEntity = await this.agencyRepository.findOne({
        where: { id },
        relations: ['apprentices', 'groups', 'artistMemberships']
        });

        if (!agencyEntity) {
        throw new Error('Agency not found');
        }

        return this.agencyMapper.toDomainEntity(agencyEntity);
    }
    async findAll(): Promise<Agency[]> {
        const agencyEntities = await this.agencyRepository.find({
        relations: ['apprentices', 'groups', 'artistMemberships']
        });

        return agencyEntities.map((entity : AgencyEntity) => 
        this.agencyMapper.toDomainEntity(entity)
        );
    }

    async save(domainEntity: Agency): Promise<Agency> {
        const agencyEntity = this.agencyMapper.toDataBaseEntity(domainEntity);
        const savedEntity = await this.agencyRepository.save(agencyEntity);
        return this.agencyMapper.toDomainEntity(savedEntity);
    }
    async delete(id: string): Promise<void> {
        const result = await this.agencyRepository.delete(id);
        
        if (result.affected === 0) {
        throw new Error('Agency not found for deletion');
        }
    }

}