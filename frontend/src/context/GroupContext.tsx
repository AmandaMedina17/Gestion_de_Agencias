// GroupContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { groupService } from '../services/GroupService';
import { CreateGroupDto } from '../../../backend/src/ApplicationLayer/DTOs/groupDto/create-group.dto';
import { GroupResponseDto } from '../../../backend/src/ApplicationLayer/DTOs/groupDto/response-group.dto';
import { GroupStatus } from '../../../backend/src/DomainLayer/Enums';
import { AddMemberToGroupDto } from '../../../backend/src/ApplicationLayer/DTOs/membershipDto/add-member-to-group.dto';
import { ResponseMembershipDto } from '../../../backend/src/ApplicationLayer/DTOs/membershipDto/response-membership.dto';
import { CreateArtistDto } from '../../../backend/src/ApplicationLayer/DTOs/artistDto/create-artist.dto';
import { ArtistResponseDto } from '../../../backend/src/ApplicationLayer/DTOs/artistDto/response-artist.dto';

interface GroupContextType {
  // Estado
  groups: GroupResponseDto[];
  loading: boolean;
  error: string | null;
  
  // Estado para miembros
  currentGroupMembers: ResponseMembershipDto[];
  membersLoading: boolean;
  membersError: string | null;

  // Acciones
  createGroup: (createDto: CreateGroupDto) => Promise<void>;
  fetchGroups: () => Promise<void>;
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
  clearError: () => void;

  // Nuevas acciones para miembros
  addMemberToGroup: (groupId: string, addMemberDto: AddMemberToGroupDto) => Promise<ResponseMembershipDto>;
  getGroupMembers: (groupId: string) => Promise<ArtistResponseDto[]>;
  removeMemberFromGroup: (groupId: string, artistId: string) => Promise<void>;
  
  // Para crear artista cuando no existe
  createArtistForTrainee: (createArtistDto: CreateArtistDto) => Promise<ArtistResponseDto>;
}

interface GroupProviderProps {
  children: ReactNode;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export const useGroup = () => {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error('useGroup must be used within a GroupProvider');
  }
  return context;
};

export const GroupProvider: React.FC<GroupProviderProps> = ({ children }) => {
  const [groups, setGroups] = useState<GroupResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para miembros
  const [currentGroupMembers, setCurrentGroupMembers] = useState<ResponseMembershipDto[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState<string | null>(null);

  const createGroup = async (createDto: CreateGroupDto) => {
    setLoading(true);
    setError(null);
    try {
      const newGroup = await groupService.create(createDto);
      setGroups(prev => [...prev, newGroup]);
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
    } catch (err: any) {
      setError(err.message || 'Error al cargar grupos');
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
      await groupService.update(id, updateData);
      await fetchGroups(); // Recargar la lista
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el grupo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Nuevas funciones para manejar miembros

  const addMemberToGroup = async (groupId: string, addMemberDto: AddMemberToGroupDto) => {
    setMembersLoading(true);
    setMembersError(null);
    try {
      const newMembership = await groupService.addMember(groupId, addMemberDto);
      // Actualizar la lista de miembros del grupo actual
      setCurrentGroupMembers(prev => [...prev, newMembership]);
      // Actualizar el contador de miembros en la lista de grupos
      setGroups(prev => prev.map(group => {
        if (group.id === groupId) {
          return { ...group, members_num: group.members_num + 1 };
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
      //setCurrentGroupMembers(members);
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
      await groupService.removeMember(groupId, artistId);
      // Actualizar la lista de miembros
      setCurrentGroupMembers(prev => prev.filter(member => member.artistId !== artistId));
      // Actualizar el contador de miembros en la lista de grupos
      setGroups(prev => prev.map(group => {
        if (group.id === groupId) {
          return { ...group, members_num: Math.max(0, group.members_num - 1) };
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
      loading,
      error,
      currentGroupMembers,
      membersLoading,
      membersError,
      createGroup,
      fetchGroups,
      fetchGroup,
      deleteGroup,
      updateGroup,
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