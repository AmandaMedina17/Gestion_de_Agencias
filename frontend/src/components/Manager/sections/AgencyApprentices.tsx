import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { agencyService } from '../../../services/AgencyService'
import { ApprenticeResponseDto } from '../../../../../backend/src/ApplicationLayer/DTOs/apprenticeDto/response-apprentice.dto';
import { AgencyResponseDto } from '../../../../../backend/src/ApplicationLayer/DTOs/agencyDto/response-agency.dto';
import GenericTable from '../../ui/datatable';
import { Column } from '../../ui/datatable';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import NumbersIcon from '@mui/icons-material/Numbers';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import './AgencyApprentices.css';

// Enums locales (si no están importados directamente del backend)
export enum ApprenticeTrainingLevel {
  PRINCIPIANTE = "PRINCIPIANTE",
  INTERMEDIO = "INTERMEDIO",
  AVANZADO = "AVANZADO",
}

export enum ApprenticeStatus {
  EN_ENTRENAMIENTO = "EN_ENTRENAMIENTO",
  PROCESO_DE_SELECCION = "PROCESO_DE_SELECCION",
  TRANSFERIDO = "TRANSFERIDO",
}

interface AgencyApprenticesViewProps {
  showActions?: boolean;
  readOnly?: boolean;
  onApprenticeSelect?: (apprentice: ApprenticeResponseDto) => void;
}

const AgencyApprenticesView: React.FC<AgencyApprenticesViewProps> = ({
  showActions = true,
  readOnly = false,
  onApprenticeSelect,
}) => {
  const { user } = useAuth();
  const [apprentices, setApprentices] = useState<ApprenticeResponseDto[]>([]);
  const [agencyInfo, setAgencyInfo] = useState<AgencyResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info' | 'warning';
    title?: string;
    message: string;
  } | null>(null);

  const agencyId = user?.agency;

  // Cargar aprendices e información de la agencia
  const fetchApprentices = async () => {
    if (!agencyId) {
      setError('No se pudo identificar la agencia');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const apprenticesData = await agencyService.getAgencyApprentices(agencyId);
      setApprentices(apprenticesData);
      
      try {
        const agencyData = await agencyService.findOne(agencyId);
        setAgencyInfo(agencyData);
      } catch (agencyErr) {
        console.warn('No se pudo cargar información adicional de la agencia:', agencyErr);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar los aprendices');
      console.error('Error fetching apprentices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (agencyId) {
      fetchApprentices();
    }
  }, [agencyId]);

  const formatDate = (date: Date | string) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'dd/MM/yyyy', { locale: es });
    } catch {
      return 'Fecha inválida';
    }
  };

  const getStatusText = (status: ApprenticeStatus) => {
    switch (status) {
      case ApprenticeStatus.EN_ENTRENAMIENTO: return 'En entrenamiento';
      case ApprenticeStatus.PROCESO_DE_SELECCION: return 'En proceso de selección';
      case ApprenticeStatus.TRANSFERIDO: return 'Transferido';
      default: return status;
    }
  };

  const getStatusColor = (status: ApprenticeStatus) => {
    switch (status) {
      case ApprenticeStatus.EN_ENTRENAMIENTO: return 'primary';
      case ApprenticeStatus.PROCESO_DE_SELECCION: return 'warning';
      case ApprenticeStatus.TRANSFERIDO: return 'success';
      default: return 'default';
    }
  };

  const getTrainingLevelText = (level: ApprenticeTrainingLevel) => {
    switch (level) {
      case ApprenticeTrainingLevel.PRINCIPIANTE: return 'Principiante';
      case ApprenticeTrainingLevel.INTERMEDIO: return 'Intermedio';
      case ApprenticeTrainingLevel.AVANZADO: return 'Avanzado';
      default: return level;
    }
  };

  const getTrainingLevelColor = (level: ApprenticeTrainingLevel) => {
    switch (level) {
      case ApprenticeTrainingLevel.PRINCIPIANTE: return 'primary';
      case ApprenticeTrainingLevel.INTERMEDIO: return 'warning';
      case ApprenticeTrainingLevel.AVANZADO: return 'success';
      default: return 'default';
    }
  };

  const renderStatus = (status: ApprenticeStatus) => (
    <Chip
      label={getStatusText(status)}
      color={getStatusColor(status)}
      size="small"
      variant="outlined"
      sx={{ fontWeight: 500 }}
    />
  );

  const renderTrainingLevel = (level: ApprenticeTrainingLevel) => (
    <Chip
      label={getTrainingLevelText(level)}
      color={getTrainingLevelColor(level)}
      size="small"
      variant="outlined"
      sx={{ fontWeight: 500 }}
    />
  );

  // Definir columnas basadas en el DTO
  const getApprenticeColumns = (): Column<ApprenticeResponseDto>[] => [
    {
      key: 'fullName',
      title: 'Nombre Completo',
      sortable: true,
      width: '200px',
      render: (item) => (
        <div className="apprentice-name-cell">
          <Box display="flex" alignItems="center" gap={1}>
            <PersonIcon fontSize="small" color="primary" />
            <Typography variant="body1" fontWeight="medium">
              {item.fullName}
            </Typography>
          </Box>
        </div>
      ),
    },
    {
      key: 'age',
      title: 'Edad',
      sortable: true,
      width: '100px',
      align: 'center',
      render: (item) => (
        <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
          <NumbersIcon fontSize="small" color="action" />
          <Typography variant="body1" fontWeight="medium">
            {item.age} años
          </Typography>
        </Box>
      ),
    },
    {
      key: 'entryDate',
      title: 'Fecha de Ingreso',
      sortable: true,
      width: '140px',
      align: 'center',
      render: (item) => (
        <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
          <CalendarTodayIcon fontSize="small" color="action" />
          <Typography variant="body2">
            {formatDate(item.entryDate)}
          </Typography>
        </Box>
      ),
    },
    {
      key: 'status',
      title: 'Estado',
      sortable: true,
      width: '160px',
      align: 'center',
      render: (item) => renderStatus(item.status as ApprenticeStatus),
    },
    {
      key: 'trainingLevel',
      title: 'Nivel de Entrenamiento',
      sortable: true,
      width: '160px',
      align: 'center',
      render: (item) => renderTrainingLevel(item.trainingLevel as ApprenticeTrainingLevel),
    },
  ];

  const handleViewDetails = (apprentice: ApprenticeResponseDto) => {
    if (onApprenticeSelect) {
      onApprenticeSelect(apprentice);
    } else {
      setNotification({
        type: 'info',
        title: 'Detalles del Aprendiz',
        message: `Ver detalles de ${apprentice.fullName}`,
      });
    }
  };

  const handleNotificationClose = () => {
    setNotification(null);
  };

  if (!agencyId) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        No tienes una agencia asignada. Contacta al administrador para que te asigne una.
      </Alert>
    );
  }

  // Estadísticas por estado según el enum
  const statsByStatus = [
    {
      label: 'En Entrenamiento',
      value: apprentices.filter(a => a.status === ApprenticeStatus.EN_ENTRENAMIENTO).length,
      color: '#1976d2',
      status: ApprenticeStatus.EN_ENTRENAMIENTO,
      icon: '🏋️',
    },
    {
      label: 'En Proceso de Selección',
      value: apprentices.filter(a => a.status === ApprenticeStatus.PROCESO_DE_SELECCION).length,
      color: '#ed6c02',
      status: ApprenticeStatus.PROCESO_DE_SELECCION,
      icon: '📋',
    },
    {
      label: 'Transferidos',
      value: apprentices.filter(a => a.status === ApprenticeStatus.TRANSFERIDO).length,
      color: '#2e7d32',
      status: ApprenticeStatus.TRANSFERIDO,
      icon: '🔄',
    },
  ];

  // Estadísticas por nivel de entrenamiento
  const statsByTrainingLevel = [
    {
      label: 'Principiantes',
      value: apprentices.filter(a => a.trainingLevel === ApprenticeTrainingLevel.PRINCIPIANTE).length,
      color: '#1976d2',
      level: ApprenticeTrainingLevel.PRINCIPIANTE,
      icon: '👶',
    },
    {
      label: 'Intermedios',
      value: apprentices.filter(a => a.trainingLevel === ApprenticeTrainingLevel.INTERMEDIO).length,
      color: '#ed6c02',
      level: ApprenticeTrainingLevel.INTERMEDIO,
      icon: '👨‍🎓',
    },
    {
      label: 'Avanzados',
      value: apprentices.filter(a => a.trainingLevel === ApprenticeTrainingLevel.AVANZADO).length,
      color: '#2e7d32',
      level: ApprenticeTrainingLevel.AVANZADO,
      icon: '👨‍🏫',
    },
  ];

  return (
    <div className="agency-apprentices-artist-view">
      <Box sx={{ mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <div>
            <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
              Aprendices de la Agencia
            </Typography>
            {agencyInfo && (
              <Typography variant="subtitle1" color="text.secondary">
                {agencyInfo.nameAgency}
              </Typography>
            )}
          </div>
          
          <Box display="flex" gap={2}>
            <Button
              startIcon={<RefreshIcon />}
              onClick={fetchApprentices}
              disabled={loading}
              variant="outlined"
              size="small"
            >
              Actualizar
            </Button>
          </Box>
        </Box>

        {/* Estadísticas por estado */}
        {apprentices.length > 0 && (
          <Box mb={3}>
            
            <Box display="flex" gap={2} mb={2} className="stats-container">
              <div className="stat-card total">
                <Typography variant="body2" color="text.secondary">
                  Total Aprendices
                </Typography>
                <Typography variant="h5" className="stat-value-total">
                  {apprentices.length}
                </Typography>
              </div>
              {statsByStatus.map((stat, index) => (
                <div key={index} className="stat-card" style={{ borderLeft: `4px solid ${stat.color}` }}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <span style={{ fontSize: '20px' }}>{stat.icon}</span>
                    <Typography variant="body2" color="text.secondary" fontWeight="medium">
                      {stat.label}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="h5" 
                    className="stat-value" 
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {apprentices.length > 0 ? ((stat.value / apprentices.length) * 100).toFixed(0) : 0}%
                  </Typography>
                </div>
              ))}
            </Box>
          </Box>
        )}

        
      </Box>

      {/* Tabla de aprendices */}
      <GenericTable<ApprenticeResponseDto>
        data={apprentices}
        columns={getApprenticeColumns()}
        title=""
        loading={loading}
        itemsPerPage={10}
        showHeader={false}
        showCreateButton={false}
        showActionsColumn={false}
        showSearch={true}
        showReloadButton={false}
        onReload={fetchApprentices}
        notification={notification || undefined}
        onNotificationClose={handleNotificationClose}
        className="apprentices-table"
        
        emptyState={
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No hay aprendices en esta agencia
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {agencyInfo 
                ? `No se han registrado aprendices en ${agencyInfo.nameAgency}`
                : 'No hay aprendices registrados'
              }
            </Typography>
          </Box>
        }
        
        loadingComponent={
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Cargando aprendices...
            </Typography>
          </Box>
        }
        
        renderCustomActions={showActions && !readOnly ? (apprentice) => (
          <div className="apprentice-actions">
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleViewDetails(apprentice)}
              sx={{ 
                fontSize: '0.75rem',
                textTransform: 'none',
                fontWeight: 'medium'
              }}
            >
              Ver Detalles
            </Button>
          </div>
        ) : undefined}
      />

      
    </div>
  );
};

export default AgencyApprenticesView;