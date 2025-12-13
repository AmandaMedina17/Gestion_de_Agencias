import React, { useState, useEffect } from "react";
import { useGroup } from "../../../context/GroupContext";
import { useArtist } from "../../../context/ArtistContext";
import { useApprentice } from "../../../context/ApprenticeContext";
import { GroupResponseDto } from "../../../../../backend/src/ApplicationLayer/DTOs/groupDto/response-group.dto";
import { Icon } from "../../icons";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Avatar,
  Chip,
  Tooltip,
} from '@mui/material';
import { ArtistResponseDto } from "../../../../../backend/src/ApplicationLayer/DTOs/artistDto/response-artist.dto";
import { ResponseMembershipDto } from "../../../../../backend/src/ApplicationLayer/DTOs/membershipDto/response-membership.dto";

interface ViewMembersModalProps {
  group: GroupResponseDto;
  onClose: () => void;
  onRemoveMember: (artistId: string) => Promise<void>;
}

interface MemberWithDetails {
  artist: ArtistResponseDto;
  apprentice?: any;
  membership?: ResponseMembershipDto; // Opcional, ya que no viene en ArtistResponseDto
}

const ViewMembersModal: React.FC<ViewMembersModalProps> = ({
  group,
  onClose,
  onRemoveMember,
}) => {
  const { currentGroupMembers, membersLoading, membersError, getGroupMembers } = useGroup();
  const { artists, fetchArtists } = useArtist();
  const { apprentices, fetchApprentices } = useApprentice();
  
  const [removingArtistId, setRemovingArtistId] = useState<string | null>(null);
  const [membersWithDetails, setMembersWithDetails] = useState<MemberWithDetails[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [groupArtists, setGroupArtists] = useState<ArtistResponseDto[]>([]);

  // Cargar datos cuando se abre el modal
  useEffect(() => {
    const loadData = async () => {
      setLoadingDetails(true);
      try {
        // 1. Cargar miembros del grupo (ahora devuelve ArtistResponseDto[])
        const artistsData = await getGroupMembers(group.id);
        setGroupArtists(artistsData);
        
        // 2. Cargar artistas y aprendices para obtener información completa
        await Promise.all([
          fetchArtists(),
          fetchApprentices()
        ]);
        
      } catch (error) {
        console.error("Error cargando detalles de miembros:", error);
      } finally {
        setLoadingDetails(false);
      }
    };

    loadData();
  }, [group.id]);

  // Combinar información cuando los datos estén disponibles
  useEffect(() => {
    if (!membersLoading && groupArtists.length >= 0) {
      const membersDetails = groupArtists.map(artist => {
        // Buscar información adicional del artista si está disponible
        const fullArtistInfo = artists.find(a => a.id === artist.id) || artist;
        let apprentice = null;
        
        if (fullArtistInfo && fullArtistInfo.apprenticeId) {
          apprentice = apprentices.find(app => app.id === fullArtistInfo.apprenticeId);
        }
        
        return {
          artist: fullArtistInfo,
          apprentice
        };
      });
      
      setMembersWithDetails(membersDetails);
    }
  }, [groupArtists, artists, apprentices, membersLoading]);

  const handleRemoveMember = async (artistId: string) => {
    
      setRemovingArtistId(artistId);
      try {
        await onRemoveMember(artistId);
        const updatedArtists = await getGroupMembers(group.id);
        setGroupArtists(updatedArtists);
      } finally {
        setRemovingArtistId(null);
      }
    
  };

  // Función para refrescar manualmente
  const handleManualRefresh = async () => {
    setLoadingDetails(true);
    try {
      const updatedArtists = await getGroupMembers(group.id);
      setGroupArtists(updatedArtists);
      await Promise.all([
        fetchArtists(),
        fetchApprentices()
      ]);
    } catch (error) {
      console.error("Error refrescando datos:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Función para obtener el nombre completo del artista/aprendiz
  const getMemberName = (member: MemberWithDetails) => {
    if (member.artist) {
      return member.artist.stageName || "Nombre no disponible";
    }
    return "Artista no encontrado";
  };

  // Función para obtener información del aprendiz
  const getApprenticeInfo = (member: MemberWithDetails) => {
    if (member.apprentice) {
      return member.apprentice.fullName || "Aprendiz sin nombre";
    }
    if (member.artist && member.artist.apprenticeId) {
      return `Aprendiz ID: ${member.artist.apprenticeId}`;
    }
    return "Sin aprendiz asociado";
  };

  // Función para obtener el estado del artista
  const getArtistStatus = (member: MemberWithDetails) => {
    if (!member.artist) return "Desconocido";
    
    const statusMap: Record<string, string> = {
      "ACTIVO": "Activo",
      "EN_PAUSA": "En Pausa",
      "INACTIVO": "Inactivo"
    };
    
    return statusMap[member.artist.status] || member.artist.status;
  };

  // Función para obtener el color del estado
  const getStatusColor = (member: MemberWithDetails) => {
    if (!member.artist) return "default";
    
    switch (member.artist.status) {
      case "ACTIVO": return "success";
      case "EN_PAUSA": return "warning";
      case "INACTIVO": return "error";
      default: return "default";
    }
  };

  // Función para formatear fecha
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A";
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString("es-ES");
    } catch {
      return "Fecha inválida";
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: "900px" }}>
        <div className="modal-header">
          <h3>Miembros de {group.name}</h3>
          <Typography variant="subtitle2" color="textSecondary">
            {group.concept}
          </Typography>
          <button className="close-btn" onClick={onClose}>
            <Icon name="close" size={20} />
          </button>
        </div>

        {membersError && (
          <div className="message error">
            {membersError}
          </div>
        )}

        {loadingDetails ? (
          <Box display="flex" justifyContent="center" py={4} flexDirection="column" alignItems="center">
            <CircularProgress />
            <Typography variant="body2" sx={{ mt: 2 }}>
              Cargando información de miembros...
            </Typography>
          </Box>
        ) : membersWithDetails.length === 0 ? (
          <Box py={4} textAlign="center">
            <Typography variant="body1" color="textSecondary">
              Este grupo no tiene miembros aún.
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer component={Paper} sx={{ maxHeight: "500px", overflow: "auto" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Artista</TableCell>
                    <TableCell>Edad</TableCell>
                    <TableCell>Estado</TableCell>
                    {/* 
                    <TableCell>Rol en el Grupo</TableCell>
                    <TableCell>Fecha de Inicio</TableCell>
                    <TableCell>Fecha de Fin</TableCell>
                    */}
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {membersWithDetails.map((member, index) => (
                    <TableRow key={member.artist.id || index} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              width: 36, 
                              height: 36, 
                              mr: 2,
                              bgcolor: member.artist ? 'primary.main' : 'grey.300'
                            }}
                          >
                            {member.artist ? (member.artist.stageName?.charAt(0) || 'A') : '?'}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {getMemberName(member)}
                            </Typography>
                           
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                       
                        {member.apprentice && member.apprentice.age && (
                          <Typography variant="caption" color="textSecondary" display="block">
                             {member.apprentice.age} años
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getArtistStatus(member)}
                          color={getStatusColor(member) as any}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                    
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleRemoveMember(member.artist.id)}
                          disabled={removingArtistId === member.artist.id}
                          startIcon={<Icon name="trash" size={14} />}
                        >
                          {removingArtistId === member.artist.id ? (
                            <CircularProgress size={16} />
                          ) : (
                            "Remover"
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="textSecondary">
                Total de miembros: {membersWithDetails.length}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={handleManualRefresh}
                startIcon={<Icon name="reload" size={14} />}
                disabled={loadingDetails}
              >
                Actualizar
              </Button>
            </Box>
          </>
        )}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="cancel-button"
            onClick={onClose}
          >
            <Icon name="close" size={18} />
            Cerrar
          </button>
        </Box>
      </div>
    </div>
  );
};

export default ViewMembersModal;