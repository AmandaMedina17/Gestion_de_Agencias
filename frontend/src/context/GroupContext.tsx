import React, { createContext, useContext, useState, ReactNode } from 'react';
import { groupService } from '../services/GroupService';
import { CreateGroupDto } from '../../../backend/src/ApplicationLayer/DTOs/groupDto/create-group.dto';
import { GroupResponseDto } from '../../../backend/src/ApplicationLayer/DTOs/groupDto/response-group.dto';
import { GroupStatus } from '../../../backend/src/DomainLayer/Enums';
import { AddMemberToGroupDto } from '../../../backend/src/ApplicationLayer/DTOs/membershipDto/add-member-to-group.dto';
import { LeaveGroupDto } from '../../../backend/src/ApplicationLayer/DTOs/membershipDto/leave-group.dto'; // AÑADIR ESTA IMPORTACIÓN
import { ResponseMembershipDto } from '../../../backend/src/ApplicationLayer/DTOs/membershipDto/response-membership.dto';
import { CreateArtistDto } from '../../../backend/src/ApplicationLayer/DTOs/artistDto/create-artist.dto';
import { ArtistResponseDto } from '../../../backend/src/ApplicationLayer/DTOs/artistDto/response-artist.dto';

interface GroupContextType {
  groups: GroupResponseDto[];
  notCreatedGroups: GroupResponseDto[];
  loading: boolean;
  error: string | null;
  
  currentGroupMembers: ResponseMembershipDto[];
  membersLoading: boolean;
  membersError: string | null;

  createGroup: (createDto: CreateGroupDto) => Promise<void>;
  fetchGroups: () => Promise<void>;
  fetchNotCreatedGroups: () => Promise<void>;
  fetchGroup: (id: string) => Promise<GroupResponseDto | null>;
  deleteGroup: (id: string) => Promise<void>;
  updateGroup: (id: string, updateData: { 
    name: string, 
    status: GroupStatus, 
    debut_date: Date, 
    concept: string, 
    is_created: boolean,
    agencyId: string 
  }) => Promise<void>;
  activateGroup: (id: string) => Promise<void>;
  clearError: () => void;

  addMemberToGroup: (addMemberDto: AddMemberToGroupDto) => Promise<ResponseMembershipDto>;
  getGroupMembers: (groupId: string) => Promise<ArtistResponseDto[]>;
  removeMemberFromGroup: (groupId: string, artistId: string) => Promise<void>;
  
  createArtistForTrainee: (createArtistDto: CreateArtistDto) => Promise<ArtistResponseDto>;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export const useGroup = () => {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error('useGroup must be used within a GroupProvider');
  }
  return context;
};

export const GroupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [groups, setGroups] = useState<GroupResponseDto[]>([]);
  const [notCreatedGroups, setNotCreatedGroups] = useState<GroupResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [currentGroupMembers, setCurrentGroupMembers] = useState<ResponseMembershipDto[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState<string | null>(null);

  const createGroup = async (createDto: CreateGroupDto) => {
    setLoading(true);
    setError(null);
    try {
      const newGroup = await groupService.create(createDto);
      setGroups(prev => [...prev, newGroup]);
      if (!newGroup.is_created) {
        setNotCreatedGroups(prev => [...prev, newGroup]);
      }
    } catch (err: any) {
      setError(err.message || 'Error al crear grupo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await groupService.findAll();
      setGroups(data);
      const notCreated = data.filter(group => !group.is_created);
      setNotCreatedGroups(notCreated);
    } catch (err: any) {
      setError(err.message || 'Error al cargar grupos');
    } finally {
      setLoading(false);
    }
  };

  const fetchNotCreatedGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await groupService.getNotCreatedGroups();
      setNotCreatedGroups(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar grupos no creados');
    } finally {
      setLoading(false);
    }
  };

  const fetchGroup = async (id: string): Promise<GroupResponseDto | null> => {
    setLoading(true);
    setError(null);
    try {
      return await groupService.findOne(id);
    } catch (err: any) {
      setError(err.message || 'Error al cargar grupo');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteGroup = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await groupService.remove(id);
      setGroups(prev => prev.filter(group => group.id !== id));
      setNotCreatedGroups(prev => prev.filter(group => group.id !== id));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar grupo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateGroup = async (id: string, updateData: { 
    name: string, 
    status: GroupStatus, 
    debut_date: Date, 
    concept: string, 
    is_created: boolean,
    agencyId: string 
  }) => {
    setLoading(true);
    setError(null);
    try {
      const updatedGroup = await groupService.update(id, updateData);
      
      setGroups(prev => prev.map(group => 
        group.id === id ? { ...updatedGroup } : group
      ));
      
      if (updatedGroup.is_created) {
        setNotCreatedGroups(prev => prev.filter(group => group.id !== id));
      } else {
        setNotCreatedGroups(prev => prev.map(group => 
          group.id === id ? { ...updatedGroup } : group
        ));
      }
      
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el grupo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const activateGroup = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const activatedGroup = await groupService.activateGroup(id);
      
      setGroups(prev => prev.map(group => 
        group.id === id ? { ...activatedGroup, is_created: true } : group
      ));
      
      setNotCreatedGroups(prev => prev.filter(group => group.id !== id));
      
    } catch (err: any) {
      setError(err.message || 'Error al activar el grupo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addMemberToGroup = async (addMemberDto: AddMemberToGroupDto) => {
    setMembersLoading(true);
    setMembersError(null);
    try {
      // CORREGIDO: Ahora solo necesita el DTO
      const newMembership = await groupService.addMember(addMemberDto);
      setCurrentGroupMembers(prev => [...prev, newMembership]);
      
      // Actualizar el contador de miembros
      setGroups(prev => prev.map(group => {
        if (group.id === addMemberDto.groupId) {
          return { 
            ...group, 
            members_num: (group.members_num || 0) + 1 
          };
        }
        return group;
      }));
      
      return newMembership;
    } catch (err: any) {
      setMembersError(err.message || 'Error al agregar miembro al grupo');
      throw err;
    } finally {
      setMembersLoading(false);
    }
  };

  const getGroupMembers = async (groupId: string): Promise<ArtistResponseDto[]> => {
    setMembersLoading(true);
    setMembersError(null);
    try {
      const members = await groupService.getGroupMembers(groupId);
      return members;
    } catch (err: any) {
      setMembersError(err.message || 'Error al cargar miembros del grupo');
      throw err;
    } finally {
      setMembersLoading(false);
    }
  };

  const removeMemberFromGroup = async (groupId: string, artistId: string) => {
    setMembersLoading(true);
    setMembersError(null);
    try {
      // CORREGIDO: Crear el DTO y llamar al servicio correctamente
      const leaveGroupDto: LeaveGroupDto = {
        groupId,
        artistId
      };
      
      await groupService.removeMember(leaveGroupDto);
      
      // Actualizar la lista de miembros
      setCurrentGroupMembers(prev => prev.filter(member => 
        member.artistId !== artistId || member.groupId !== groupId
      ));
      
      // Actualizar el contador de miembros
      setGroups(prev => prev.map(group => {
        if (group.id === groupId) {
          return { 
            ...group, 
            members_num: Math.max(0, (group.members_num || 1) - 1) 
          };
        }
        return group;
      }));
      
    } catch (err: any) {
      setMembersError(err.message || 'Error al remover miembro del grupo');
      throw err;
    } finally {
      setMembersLoading(false);
    }
  };

  const createArtistForTrainee = async (createArtistDto: CreateArtistDto): Promise<ArtistResponseDto> => {
    setMembersLoading(true);
    setMembersError(null);
    try {
      const newArtist = await groupService.createArtist(createArtistDto);
      return newArtist;
    } catch (err: any) {
      setMembersError(err.message || 'Error al crear artista');
      throw err;
    } finally {
      setMembersLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
    setMembersError(null);
  };

  return (
    <GroupContext.Provider value={{
      groups,
      notCreatedGroups,
      loading,
      error,
      currentGroupMembers,
      membersLoading,
      membersError,
      createGroup,
      fetchGroups,
      fetchNotCreatedGroups,
      fetchGroup,
      deleteGroup,
      updateGroup,
      activateGroup,
      addMemberToGroup,
      getGroupMembers,
      removeMemberFromGroup,
      createArtistForTrainee,
      clearError,
    }}>
      {children}
    </GroupContext.Provider>
  );
};