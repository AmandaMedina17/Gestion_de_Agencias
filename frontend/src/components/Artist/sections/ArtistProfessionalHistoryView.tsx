import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useArtist } from '../../../context/ArtistContext';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import './ProfessionalHistory.css';

// Iconos
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import DescriptionIcon from '@mui/icons-material/Description';
import HandshakeIcon from '@mui/icons-material/Handshake';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventIcon from '@mui/icons-material/Event';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { ContractStatus } from '../../Admin/sections/Contract/ContractManagement';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Opciones de exportación
interface ExportOptions {
  includeSummary: boolean;
  includeTimeline: boolean;
  includeContracts: boolean;
  includeGroupCollaborations: boolean;
  includeDebuts: boolean;
  includeArtistCollaborations: boolean;
  includeActivities: boolean;
  fileName: string;
}

const ArtistProfessionalHistoryView: React.FC = () => {
  const { user } = useAuth();
  const { 
    professionalHistory,
    professionalHistoryLoading,
    professionalHistoryError,
    fetchProfessionalHistory,
    clearProfessionalHistoryError
  } = useArtist();
  
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    open: boolean;
  } | null>(null);
  
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includeSummary: true,
    includeTimeline: true,
    includeContracts: true,
    includeGroupCollaborations: true,
    includeDebuts: true,
    includeArtistCollaborations: true,
    includeActivities: true,
    fileName: "historial-profesional-artista"
  });

  // Referencias para capturar elementos para el PDF
  const reportRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const contractsRef = useRef<HTMLDivElement>(null);
  const groupCollabsRef = useRef<HTMLDivElement>(null);
  const debutsRef = useRef<HTMLDivElement>(null);
  const artistCollabsRef = useRef<HTMLDivElement>(null);
  const activitiesRef = useRef<HTMLDivElement>(null);

  const artistId = user?.artist;

  // Cargar historial profesional
  const loadHistory = async () => {
    if (!artistId) {
      setNotification({
        type: 'error',
        message: 'No se pudo identificar al artista',
        open: true
      });
      return;
    }

    try {
      await fetchProfessionalHistory(artistId);
      setNotification({
        type: 'success',
        message: 'Historial cargado exitosamente',
        open: true
      });
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Error al cargar el historial',
        open: true
      });
    }
  };

  useEffect(() => {
    if (artistId) {
      loadHistory();
    }
  }, [artistId]);

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return 'Presente';
    try {
      return format(new Date(date), 'dd/MM/yyyy', { locale: es });
    } catch {
      return 'Fecha inválida';
    }
  };

  // Formatear fecha para nombre de archivo
  const formatFileNameDate = (date: Date) => {
    return format(date, 'yyyy-MM-dd');
  };

  // Construir timeline combinando eventos de diferentes fuentes
  const buildTimeline = () => {
    const timelineEvents: Array<{
      id: string;
      date: Date | string | null;
      title: string;
      description: string;
      type: string;
    }> = [];

    // Agregar debuts al timeline
    if (professionalHistory?.debutHistory) {
      professionalHistory.debutHistory.forEach(debut => {
        timelineEvents.push({
          id: `debut-${debut.role}`,
          date: debut.debutDate,
          title: debut.role || `Debut en ${debut.group?.name || 'grupo'}`,
          description: debut.role || `Rol: ${debut.role || 'Miembro'}`,
          type: 'DEBUT'
        });
      });
    }

    // Agregar contratos activos al timeline
    if (professionalHistory?.activeContracts) {
      professionalHistory.activeContracts.forEach(contract => {
        timelineEvents.push({
          id: `contract-start-${contract.id}`,
          date: contract.startDate,
          title: `Contrato con ${contract.agency?.nameAgency || 'Agencia'}`,
          description: `Porcentaje: ${contract.distributionPercentage}% - ${contract.conditions || 'Sin condiciones especificadas'}`,
          type: 'CONTRACT_START'
        });

        if (contract.endDate) {
          timelineEvents.push({
            id: `contract-end-${contract.id}`,
            date: contract.endDate,
            title: `Fin de contrato con ${contract.agency?.nameAgency || 'Agencia'}`,
            description: 'Contrato finalizado',
            type: 'CONTRACT_END'
          });
        }
      });
    }

    // Agregar colaboraciones con grupos al timeline
    if (professionalHistory?.groupCollaborations) {
      professionalHistory.groupCollaborations.forEach(collab => {
        timelineEvents.push({
          id: `group-collab-${collab.artist}`,
          date: collab.date,
          title: `Colaboración con ${collab.group?.name || 'Grupo'}`,
          description: 'Colaboración grupal',
          type: 'GROUP_COLLABORATION'
        });
      });
    }

    // Agregar colaboraciones individuales al timeline
    if (professionalHistory?.artistCollaborations) {
      professionalHistory.artistCollaborations.forEach(collab => {
        timelineEvents.push({
          id: `artist-collab-${collab.artist1}`,
          date: collab.date,
          title: `Colaboración con ${collab.artist2?.stageName || 'Artista'}`,
          description: 'Proyecto colaborativo',
          type: 'ARTIST_COLLABORATION'
        });
      });
    }

    // Agregar actividades al timeline
    if (professionalHistory?.activities) {
      professionalHistory.activities.forEach(activity => {
        activity.dates?.forEach(date => {
          timelineEvents.push({
            id: `activity-${activity.id}-${date}`,
            date: date,
            title: `${activity.classification} - ${activity.type}`,
            description: activity.responsibles?.map(r => r.name).join(', ') || 'Sin responsables',
            type: 'ACTIVITY'
          });
        });
      });
    }

    // Ordenar por fecha (más antiguo primero para timeline)
    return timelineEvents.sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  };

  // Calcular estadísticas
  const calculateStatistics = () => {
    if (!professionalHistory) return null;

    return {
      totalDebuts: professionalHistory.debutHistory?.length || 0,
      totalContracts: professionalHistory.activeContracts?.length || 0,
      artistCollaborationsCount: professionalHistory.artistCollaborations?.length || 0,
      groupCollaborationsCount: professionalHistory.groupCollaborations?.length || 0,
      totalActivities: professionalHistory.activities?.length || 0
    };
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'DEBUT': return 'success';
      case 'CONTRACT_START': return 'primary';
      case 'CONTRACT_END': return 'error';
      case 'GROUP_COLLABORATION': return 'secondary';
      case 'ARTIST_COLLABORATION': return 'info';
      case 'ACTIVITY': return 'warning';
      default: return 'default';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'DEBUT': return <StarIcon />;
      case 'CONTRACT_START': return <DescriptionIcon />;
      case 'CONTRACT_END': return <DescriptionIcon />;
      case 'GROUP_COLLABORATION': return <GroupsIcon />;
      case 'ARTIST_COLLABORATION': return <HandshakeIcon />;
      case 'ACTIVITY': return <EventIcon />;
      default: return <EventIcon />;
    }
  };

  const handleCloseNotification = () => {
    setNotification(null);
    clearProfessionalHistoryError();
  };

  // Funciones para exportar a PDF
  const handleOpenExportDialog = () => {
    if (!professionalHistory) {
      setNotification({
        type: 'error',
        message: 'No hay datos para exportar',
        open: true
      });
      return;
    }
    
    const artistName = professionalHistory.artist?.stageName?.replace(/\s+/g, '-').toLowerCase() || 'artista';
    const fileName = `historial-profesional-${artistName}-${formatFileNameDate(new Date())}`;
    setExportOptions({
      ...exportOptions,
      fileName
    });
    setExportDialogOpen(true);
  };

  const handleCloseExportDialog = () => {
    setExportDialogOpen(false);
  };

  const handleExportPDF = async () => {
    setExporting(true);
    handleCloseExportDialog();
    
    try {
      setNotification({
        type: 'info',
        message: 'Generando PDF... Esto puede tomar unos segundos.',
        open: true
      });
      
      const elementsToCapture: { element: HTMLElement | null; title: string }[] = [];
      
      // Agregar elementos según las opciones seleccionadas
      if (exportOptions.includeSummary && summaryRef.current) {
        elementsToCapture.push({ element: summaryRef.current, title: "Resumen del Artista" });
      }
      
      if (exportOptions.includeTimeline && timelineRef.current) {
        elementsToCapture.push({ element: timelineRef.current, title: "Línea de Tiempo Profesional" });
      }
      
      if (exportOptions.includeContracts && contractsRef.current) {
        elementsToCapture.push({ element: contractsRef.current, title: "Contratos Activos" });
      }
      
      if (exportOptions.includeGroupCollaborations && groupCollabsRef.current) {
        elementsToCapture.push({ element: groupCollabsRef.current, title: "Colaboraciones con Grupos" });
      }
      
      if (exportOptions.includeDebuts && debutsRef.current) {
        elementsToCapture.push({ element: debutsRef.current, title: "Historial de Debuts" });
      }
      
      if (exportOptions.includeArtistCollaborations && artistCollabsRef.current) {
        elementsToCapture.push({ element: artistCollabsRef.current, title: "Colaboraciones con Artistas" });
      }
      
      if (exportOptions.includeActivities && activitiesRef.current) {
        elementsToCapture.push({ element: activitiesRef.current, title: "Actividades" });
      }
      
      if (elementsToCapture.length === 0) {
        setNotification({
          type: 'error',
          message: 'Selecciona al menos una sección para exportar',
          open: true
        });
        setExporting(false);
        return;
      }
      
      // Crear un nuevo documento PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - 2 * margin;
      
      let yPos = margin;
      
      // =========== CABECERA DEL REPORTE ===========
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text("Historial Profesional del Artista", pageWidth / 2, yPos, { align: "center" });
      yPos += 10;
      
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Artista: ${professionalHistory?.artist?.stageName || 'Sin nombre artístico'}`, margin, yPos);
      yPos += 6;
      pdf.text(`Estado: ${professionalHistory?.artist?.status || 'Desconocido'}`, margin, yPos);
      yPos += 6;
      pdf.text(`Fecha de nacimiento: ${formatDate(professionalHistory?.artist?.birthday)}`, margin, yPos);
      yPos += 6;
      pdf.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, margin, yPos);
      yPos += 15;
      
      // Función para verificar si hay espacio suficiente
      const checkSpace = (neededHeight: number): boolean => {
        return (yPos + neededHeight) < (pageHeight - margin - 20); // -20 para el pie de página
      };
      
      // Función para agregar nueva página si es necesario
      const addPageIfNeeded = (neededHeight: number) => {
        if (!checkSpace(neededHeight)) {
          pdf.addPage();
          yPos = margin;
          return true;
        }
        return false;
      };
      
      // =========== CAPTURAR CADA ELEMENTO ===========
      for (let i = 0; i < elementsToCapture.length; i++) {
        const { element, title } = elementsToCapture[i];
        
        if (!element) continue;
        
        // Agregar título de sección
        addPageIfNeeded(15);
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text(title, margin, yPos);
        yPos += 8;
        
        // Capturar el elemento como imagen
        const canvas = await html2canvas(element, {
          scale: 1.2,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Verificar espacio y agregar imagen
        addPageIfNeeded(imgHeight);
        pdf.addImage(imgData, 'PNG', margin, yPos, imgWidth, imgHeight);
        yPos += imgHeight + 10;
      }
      
      // =========== RESUMEN FINAL ===========
      addPageIfNeeded(60);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Resumen General", margin, yPos);
      yPos += 10;
      
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      
      const stats = calculateStatistics();
      const summaryText = [
        `Total de debuts: ${stats?.totalDebuts || 0}`,
        `Total de contratos: ${stats?.totalContracts || 0}`,
        `Colaboraciones con artistas: ${stats?.artistCollaborationsCount || 0}`,
        `Colaboraciones con grupos: ${stats?.groupCollaborationsCount || 0}`,
        `Actividades realizadas: ${stats?.totalActivities || 0}`,
        `Este historial profesional fue generado el ${new Date().toLocaleDateString('es-ES', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          weekday: 'long'
        })}.`
      ];
      
      summaryText.forEach((line, index) => {
        const lines = pdf.splitTextToSize(line, contentWidth);
        addPageIfNeeded(lines.length * 5);
        pdf.text(lines, margin, yPos);
        yPos += lines.length * 5 + 4;
      });
      
      // =========== PIE DE PÁGINA EN TODAS LAS PÁGINAS ===========
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "normal");
        pdf.text(
          `Página ${i} de ${totalPages} | Historial Profesional | ${new Date().toLocaleDateString('es-ES')}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: "center" }
        );
        
        // Agregar línea separadora
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
      }
      
      // Guardar el PDF
      pdf.save(`${exportOptions.fileName}.pdf`);
      
      setNotification({
        type: 'success',
        message: 'PDF exportado exitosamente',
        open: true
      });
    } catch (error) {
      console.error("Error al exportar PDF:", error);
      setNotification({
        type: 'error',
        message: 'Error al generar el PDF. Por favor, intenta de nuevo.',
        open: true
      });
    } finally {
      setExporting(false);
    }
  };

  // Función para exportar todo el reporte como imagen
  const handleExportFullReport = async () => {
    setExporting(true);
    
    try {
      setNotification({
        type: 'info',
        message: 'Generando reporte completo...',
        open: true
      });
      
      if (!reportRef.current) {
        setNotification({
          type: 'error',
          message: 'No se pudo capturar el reporte',
          open: true
        });
        setExporting(false);
        return;
      }
      
      // Capturar todo el reporte
      const canvas = await html2canvas(reportRef.current, {
        scale: 1.5,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 10;
      const contentWidth = pageWidth - 2 * margin;
      
      // Calcular dimensiones
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Agregar título
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text("Historial Profesional - Reporte Completo", pageWidth / 2, margin, { align: "center" });
      
      // Agregar información básica
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Artista: ${professionalHistory?.artist?.stageName || 'Sin nombre'}`, margin, margin + 15);
      pdf.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, margin, margin + 22);
      
      // Agregar imagen
      pdf.addImage(imgData, 'PNG', margin, margin + 30, imgWidth, imgHeight);
      
      // Guardar
      const artistName = professionalHistory?.artist?.stageName?.replace(/\s+/g, '-') || 'artista';
      const fileName = `historial-completo-${artistName}-${formatFileNameDate(new Date())}.pdf`;
      pdf.save(fileName);
      
      setNotification({
        type: 'success',
        message: 'Reporte completo exportado exitosamente',
        open: true
      });
    } catch (error) {
      console.error("Error al exportar reporte completo:", error);
      setNotification({
        type: 'error',
        message: 'Error al generar el reporte completo',
        open: true
      });
    } finally {
      setExporting(false);
    }
  };

  if (!artistId) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        No tienes un artista asignado. Solo los artistas pueden ver su historial profesional.
      </Alert>
    );
  }

  if (professionalHistoryLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Cargando historial profesional...
        </Typography>
      </Box>
    );
  }

  if (professionalHistoryError) {
    return (
      <Alert 
        severity="error" 
        action={
          <Button color="inherit" size="small" onClick={loadHistory}>
            Reintentar
          </Button>
        }
      >
        {professionalHistoryError}
      </Alert>
    );
  }

  const timelineEvents = buildTimeline();
  const statistics = calculateStatistics();

  return (
    <div className="artist-professional-history-view" ref={reportRef}>
      {/* Snackbar para notificaciones */}
      <Snackbar
        open={!!notification?.open}
        autoHideDuration={5000}
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setNotification(null)} 
          severity={notification?.type} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>

      <Box sx={{ mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
              Historial Profesional
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Revisa toda tu trayectoria artística en detalle
            </Typography>
          </Box>
          
          <Box display="flex" gap={1}>
            <Tooltip title="Actualizar historial">
              <Button
                startIcon={<RefreshIcon />}
                onClick={loadHistory}
                disabled={professionalHistoryLoading || exporting}
                variant="outlined"
                size="small"
              >
                Actualizar
              </Button>
            </Tooltip>
            
            {professionalHistory && (
              <>
                <Tooltip title="Exportar a PDF">
                  <Button
                    startIcon={exporting ? <CircularProgress size={20} /> : <PictureAsPdfIcon />}
                    onClick={handleOpenExportDialog}
                    disabled={exporting || !professionalHistory}
                    variant="contained"
                    size="small"
                    color="primary"
                  >
                    PDF
                  </Button>
                </Tooltip>
                
                <Tooltip title="Exportar reporte completo">
                  <Button
                    startIcon={<DownloadIcon />}
                    onClick={handleExportFullReport}
                    disabled={exporting || !professionalHistory}
                    variant="outlined"
                    size="small"
                    color="secondary"
                  >
                    Completo
                  </Button>
                </Tooltip>
              </>
            )}
          </Box>
        </Box>
      </Box>

      {professionalHistory ? (
        <>
          {/* Información del artista */}
          <Card ref={summaryRef} sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
                <Box display="flex" alignItems="center" gap={2} sx={{ width: { xs: '100%', md: '33%' } }}>
                  <PersonIcon color="primary" fontSize="large" />
                  <Box>
                    <Typography variant="h6">
                      {professionalHistory.artist?.stageName || 'Sin nombre artístico'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Estado: {professionalHistory.artist?.status || 'Desconocido'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Nacimiento: {formatDate(professionalHistory.artist?.birthday)}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ 
                  width: { xs: '95%', md: '70%' },
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'nowrap',
                  overflowX: 'auto',
                  gap: 2,
                  py: 1
                }}>
                  <Paper elevation={0} sx={{ 
                    p: 2, 
                    textAlign: 'center', 
                    bgcolor: 'primary.50',
                    minWidth: '150px',
                    flexShrink: 0
                  }}>
                    <Typography variant="h4" color="primary.main">
                      {statistics?.totalDebuts || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Debuts
                    </Typography>
                  </Paper>
                  
                  <Paper elevation={0} sx={{ 
                    p: 2, 
                    textAlign: 'center', 
                    bgcolor: 'secondary.50',
                    minWidth: '150px',
                    flexShrink: 0
                  }}>
                    <Typography variant="h4" color="secondary.main">
                      {statistics?.totalContracts || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Contratos
                    </Typography>
                  </Paper>
                  
                  <Paper elevation={0} sx={{ 
                    p: 2, 
                    textAlign: 'center', 
                    bgcolor: 'success.50',
                    minWidth: '150px',
                    flexShrink: 0
                  }}>
                    <Typography variant="h4" color="success.main">
                      {statistics?.artistCollaborationsCount || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Colab. Artistas
                    </Typography>
                  </Paper>
                  
                  <Paper elevation={0} sx={{ 
                    p: 2, 
                    textAlign: 'center', 
                    bgcolor: 'info.50',
                    minWidth: '150px',
                    flexShrink: 0
                  }}>
                    <Typography variant="h4" color="info.main">
                      {statistics?.groupCollaborationsCount || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Colab. Grupos
                    </Typography>
                  </Paper>
                  
                  <Paper elevation={0} sx={{ 
                    p: 2, 
                    textAlign: 'center', 
                    bgcolor: 'warning.50',
                    minWidth: '150px',
                    flexShrink: 0
                  }}>
                    <Typography variant="h4" color="warning.main">
                      {statistics?.totalActivities || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Actividades
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Línea de tiempo */}
          <Card ref={timelineRef} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpIcon /> Línea de Tiempo Profesional
              </Typography>
              
              {timelineEvents.length > 0 ? (
                <Timeline position="alternate">
                  {timelineEvents.map((event, index) => (
                    <TimelineItem key={event.id}>
                      <TimelineOppositeContent color="text.secondary">
                        {formatDate(event.date)}
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot >
                          {getEventIcon(event.type)}
                        </TimelineDot>
                        {index < timelineEvents.length - 1 && (
                          <TimelineConnector />
                        )}
                      </TimelineSeparator>
                      <TimelineContent>
                        <Paper elevation={3} sx={{ p: 2 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {event.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {event.description}
                          </Typography>
                          <Chip
                            label={event.type.replace('_', ' ')}
                            size="small"
                            sx={{ mt: 1 }}
                            color={getEventColor(event.type) as any}
                          />
                        </Paper>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              ) : (
                <Typography variant="body2" color="text.secondary" align="center" py={4}>
                  No hay eventos en la línea de tiempo
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Contratos Activos */}
          {professionalHistory.activeContracts && professionalHistory.activeContracts.length > 0 && (
            <Card ref={contractsRef} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DescriptionIcon /> Contratos Activos
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Agencia</TableCell>
                        <TableCell>Inicio</TableCell>
                        <TableCell>Fin</TableCell>
                        <TableCell>Porcentaje</TableCell>
                        <TableCell>Estado</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {professionalHistory.activeContracts.map((contract) => (
                        <TableRow key={contract.id}>
                          <TableCell>{contract.agency?.nameAgency || 'N/A'}</TableCell>
                          <TableCell>{formatDate(contract.startDate)}</TableCell>
                          <TableCell>{formatDate(contract.endDate)}</TableCell>
                          <TableCell>{contract.distributionPercentage}%</TableCell>
                          <TableCell>
                            <Chip
                              label={contract.status || 'ACTIVE'}
                              size="small"
                              color={
                                contract.status === ContractStatus.ACTIVO ? 'success' :
                                contract.status === ContractStatus.FINALIZADO ? 'error' : 'default'
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}

          {/* Colaboraciones con Grupos */}
          {professionalHistory.groupCollaborations && professionalHistory.groupCollaborations.length > 0 && (
            <Card ref={groupCollabsRef} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GroupsIcon /> Colaboraciones con Grupos
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Grupo</TableCell>
                        <TableCell>Fecha</TableCell>
                        <TableCell>Artista</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {professionalHistory.groupCollaborations.map((collab) => (
                        <TableRow>
                          <TableCell>{collab.group?.name || 'N/A'}</TableCell>
                          <TableCell>{formatDate(collab.date)}</TableCell>
                          <TableCell>{collab.artist?.stageName || 'N/A'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}

          {/* Historial de Debuts */}
          {professionalHistory.debutHistory && professionalHistory.debutHistory.length > 0 && (
            <Card ref={debutsRef} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StarIcon /> Historial de Debuts
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={2}>
                  {professionalHistory.debutHistory.map((debut) => (
                    <Box key={debut.role} sx={{ 
                      width: { 
                        xs: '100%', 
                        sm: 'calc(50% - 8px)', 
                        md: 'calc(33.333% - 8px)' 
                      } 
                    }}>
                      <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {debut.group?.name || 'Debut'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {formatDate(debut.debutDate)}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <strong>Rol:</strong> {debut.role || 'Miembro'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Inicio:</strong> {formatDate(debut.startDate)}
                        </Typography>
                        {debut.endDate && (
                          <Typography variant="body2">
                            <strong>Fin:</strong> {formatDate(debut.endDate)}
                          </Typography>
                        )}
                      </Paper>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Colaboraciones con Artistas */}
          {professionalHistory.artistCollaborations && professionalHistory.artistCollaborations.length > 0 && (
            <Card ref={artistCollabsRef} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HandshakeIcon /> Colaboraciones con Artistas
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Fecha</TableCell>
                        <TableCell>Artista 1</TableCell>
                        <TableCell>Artista 2</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {professionalHistory.artistCollaborations.map((collab) => (
                        <TableRow >
                          <TableCell>{formatDate(collab.date)}</TableCell>
                          <TableCell>{collab.artist1?.stageName || 'N/A'}</TableCell>
                          <TableCell>{collab.artist2?.stageName || 'N/A'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}

          {/* Actividades */}
          {professionalHistory.activities && professionalHistory.activities.length > 0 && (
            <Card ref={activitiesRef}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AssignmentIcon /> Actividades
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={2}>
                  {professionalHistory.activities.map((activity) => (
                    <Box key={activity.id} sx={{ 
                      width: { 
                        xs: '100%', 
                        sm: 'calc(50% - 8px)' 
                      } 
                    }}>
                      <Paper elevation={1} sx={{ p: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {activity.type} - {activity.classification}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Fechas: {activity.dates?.map(d => formatDate(d)).join(', ') || 'No especificadas'}
                        </Typography>
                        {activity.responsibles && activity.responsibles.length > 0 && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            <strong>Responsables:</strong> {activity.responsibles.map(r => r.name).join(', ')}
                          </Typography>
                        )}
                        {activity.places && activity.places.length > 0 && (
                          <Typography variant="body2">
                            <strong>Lugares:</strong> {activity.places.map(p => p.name).join(', ')}
                          </Typography>
                        )}
                      </Paper>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}

          {!professionalHistory.activeContracts?.length && 
           !professionalHistory.groupCollaborations?.length && 
           !professionalHistory.debutHistory?.length && 
           !professionalHistory.artistCollaborations?.length && 
           !professionalHistory.activities?.length && (
            <Alert severity="info" sx={{ mt: 2 }}>
              No hay historial profesional disponible para mostrar.
            </Alert>
          )}
        </>
      ) : (
        <Alert severity="info">
          No se ha cargado el historial profesional. Haz clic en "Actualizar" para cargar los datos.
        </Alert>
      )}

      {/* Diálogo de opciones de exportación */}
      <Dialog open={exportDialogOpen} onClose={handleCloseExportDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h6">
              <PictureAsPdfIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Exportar Historial a PDF
            </Typography>
            <IconButton onClick={handleCloseExportDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Selecciona las secciones que deseas incluir en el reporte PDF:
          </Typography>
          
          <List>
            <ListItem>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={exportOptions.includeSummary}
                    onChange={(e) => setExportOptions({...exportOptions, includeSummary: e.target.checked})}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1">Resumen del Artista</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Información básica y estadísticas
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            
            <ListItem>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={exportOptions.includeTimeline}
                    onChange={(e) => setExportOptions({...exportOptions, includeTimeline: e.target.checked})}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1">Línea de Tiempo</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Cronología de eventos profesionales
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            
            <ListItem>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={exportOptions.includeContracts}
                    onChange={(e) => setExportOptions({...exportOptions, includeContracts: e.target.checked})}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1">Contratos Activos</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Detalles de contratos vigentes
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            
            <ListItem>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={exportOptions.includeGroupCollaborations}
                    onChange={(e) => setExportOptions({...exportOptions, includeGroupCollaborations: e.target.checked})}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1">Colaboraciones con Grupos</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Trabajos realizados con grupos
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            
            <ListItem>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={exportOptions.includeDebuts}
                    onChange={(e) => setExportOptions({...exportOptions, includeDebuts: e.target.checked})}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1">Historial de Debuts</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Primeras apariciones y roles
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            
            <ListItem>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={exportOptions.includeArtistCollaborations}
                    onChange={(e) => setExportOptions({...exportOptions, includeArtistCollaborations: e.target.checked})}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1">Colaboraciones con Artistas</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Proyectos con otros artistas
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            
            <ListItem>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={exportOptions.includeActivities}
                    onChange={(e) => setExportOptions({...exportOptions, includeActivities: e.target.checked})}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1">Actividades</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Eventos y actividades realizadas
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          </List>
          
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Nota:</strong> El proceso de exportación puede tardar unos segundos dependiendo de la cantidad de datos seleccionados.
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseExportDialog} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleExportPDF}
            variant="contained"
            startIcon={<CheckIcon />}
            disabled={exporting}
          >
            {exporting ? 'Generando PDF...' : 'Generar PDF'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ArtistProfessionalHistoryView;