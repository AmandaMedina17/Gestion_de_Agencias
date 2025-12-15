import React, { useState, useEffect, useRef } from "react";
import { useActivityScheduling } from "../../../context/ActivitySchedulingContext";
import { useAgency } from "../../../context/AgencyContext";
import { useAuth } from "../../../context/AuthContext";
import { useIncome } from "../../../context/IncomeContext";
import { useActivity } from "../../../context/ActivityContext";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import RefreshIcon from "@mui/icons-material/Refresh";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import TimelineIcon from "@mui/icons-material/Timeline";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import BarChartIcon from "@mui/icons-material/BarChart";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ChartTooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { ArtistIncomeDto } from "../../../../../backend/src/ApplicationLayer/DTOs/schedule-artistDto/artist_income.dto";
import { ArtistStatus } from "../../Admin/sections/Artist/ArtistManagement";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Interfaz para el tipo de ingreso
interface Income {
  ingressId: string;
  activityId: string;
  type: string;
  mount: number;
  date: string;
  responsible: string;
}

// Interfaz para la respuesta del backend
interface ArtistIncomesResponse {
  incomes: Income[];
  totalIncome: number;
}

// Tipos de gráficos disponibles
type ChartType = 'line' | 'bar' | 'area';
type TimeGroup = 'day' | 'week' | 'month';

// Opciones de exportación
interface ExportOptions {
  includeSummary: boolean;
  includeDetails: boolean;
  includeCharts: boolean;
  includeStatistics: boolean;
  includeExecutiveSummary: boolean;
  fileName: string;
}

const ArtistIncomeReportView: React.FC = () => {
  const {
    calculateArtistIncomes,
    artistIncomes,
    incomesLoading,
    incomesError,
    clearIncomesError,
    clearArtistIncomes,
  } = useActivityScheduling();

  const { artists, fetchAgencyArtists } = useAgency();
  const { user } = useAuth();
  const { fetchIncomes, incomes: allIncomes } = useIncome();
  const { fetchActivities, activities: allActivities } = useActivity();

  const [selectedArtist, setSelectedArtist] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [chartType, setChartType] = useState<ChartType>('line');
  const [timeGroup, setTimeGroup] = useState<TimeGroup>('day');
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
    open: boolean;
  }>({ type: "info", message: "", open: false });
  
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includeSummary: true,
    includeDetails: true,
    includeCharts: true,
    includeStatistics: true,
    includeExecutiveSummary: true,
    fileName: "reporte-ingresos-artista"
  });

  // Referencias para capturar elementos para el PDF
  const reportRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const chartsRef = useRef<HTMLDivElement>(null);
  const statisticsRef = useRef<HTMLDivElement>(null);

  // Establecer fechas predeterminadas (último mes)
  useEffect(() => {
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    setStartDate(oneMonthAgo);
    setEndDate(now);
  }, []);

  // Cargar artistas de la agencia del usuario
  useEffect(() => {
    const loadArtists = async () => {
      if (user?.agency) {
        try {
          await fetchAgencyArtists(user.agency);
        } catch (err) {
          console.error("Error loading agency artists:", err);
          showNotification("error", "No se pudieron cargar los artistas de la agencia");
        }
      }
    };
    loadArtists();
  }, [user?.agency]);

  // Cargar todos los ingresos y actividades para búsqueda
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchIncomes(),
          fetchActivities()
        ]);
      } catch (err) {
        console.error("Error loading reference data:", err);
      }
    };
    loadData();
  }, []);

  const showNotification = (type: "success" | "error" | "info", message: string) => {
    setNotification({ type, message, open: true });
    setTimeout(() => setNotification({ ...notification, open: false }), 5000);
  };

  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleCalculateIncomes = async () => {
    if (!selectedArtist) {
      showNotification("error", "Por favor selecciona un artista");
      return;
    }

    if (!startDate || !endDate) {
      showNotification("error", "Por favor selecciona ambas fechas");
      return;
    }

    if (startDate > endDate) {
      showNotification("error", "La fecha de inicio no puede ser mayor a la fecha de fin");
      return;
    }

    try {
      const artistIncomeDto: ArtistIncomeDto = {
        artistId: selectedArtist,
        start_date: startDate,
        end_date: endDate,
      };

      await calculateArtistIncomes(artistIncomeDto);
      showNotification("success", "Ingresos calculados exitosamente");
    } catch (err: any) {
      console.error("Error calculating incomes:", err);
      showNotification("error", err.message || "Error al calcular ingresos");
    }
  };

  const handleClear = () => {
    setSelectedArtist("");
    clearArtistIncomes();
    clearIncomesError();
  };

  // Función para formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Función para obtener el nombre del artista por ID
  const getArtistName = (artistId: string) => {
    const artist = artists.find(a => a.id === artistId);
    return artist?.stageName || "Artista sin nombre";
  };

  // Función para formatear fecha
  const formatDate = (date: string | Date) => {
    try {
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Fecha inválida";
    }
  };

  // Función para formatear fecha corta
  const formatShortDate = (date: string | Date) => {
    try {
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString("es-ES", {
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Fecha inválida";
    }
  };

  // Función para obtener detalles del tipo de ingreso
  const getIncomeTypeDetails = (type: string) => {
    // Buscar en todos los ingresos para obtener detalles
    const incomeDetail = allIncomes.find(inc => inc.id === type);
    if (incomeDetail) {
      return {
        name: incomeDetail.incomeType || type,
        description: `Tipo: ${incomeDetail.incomeType}`
      };
    }
    
    // Si no se encuentra, usar el valor directo
    return {
      name: type,
      description: `Tipo de ingreso: ${type}`
    };
  };

  // Función para obtener detalles de la actividad
  const getActivityDetails = (activityId: string) => {
    const activity = allActivities.find(a => a.id === activityId);
    if (activity) {
      return {
        name: activity.classification || "Actividad sin nombre",
        type: activity.type || "Tipo no especificado",
        details: `${activity.classification} (${activity.type})`
      };
    }
    return {
      name: "Actividad no encontrada",
      type: "Desconocido",
      details: "ID: " + activityId.substring(0, 8) + "..."
    };
  };

  // Función para obtener el color según el tipo de pago
  const getPaymentTypeColor = (type: string) => {
    const typeDetail = getIncomeTypeDetails(type);
    const typeName = typeDetail.name.toUpperCase();
    
    switch (typeName) {
      case "EFECTIVO":
      case "CASH":
        return "success";
      case "CHEQUE":
      case "CHECK":
        return "primary";
      case "TRANSFERENCIA":
      case "TRANSFER":
        return "info";
      case "TARJETA":
      case "CARD":
      case "CREDIT_CARD":
        return "secondary";
      default:
        return "default";
    }
  };

  // Función para obtener el ícono según el tipo de pago
  const getPaymentTypeIcon = (type: string) => {
    const typeDetail = getIncomeTypeDetails(type);
    const typeName = typeDetail.name.toUpperCase();
    
    switch (typeName) {
      case "EFECTIVO":
      case "CASH":
        return <AttachMoneyIcon fontSize="small" />;
      case "CHEQUE":
      case "CHECK":
        return <AccountBalanceIcon fontSize="small" />;
      case "TARJETA":
      case "CARD":
      case "CREDIT_CARD":
        return <CreditCardIcon fontSize="small" />;
      default:
        return <AttachMoneyIcon fontSize="small" />;
    }
  };

  // Filtrar solo artistas activos
  const getActiveArtists = () => {
    return artists.filter(artist => 
      artist.status === ArtistStatus.ACTIVO 
    );
  };

  // Función para calcular estadísticas
  const calculateStatistics = () => {
    if (!artistIncomes || !artistIncomes.incomes) {
      return {
        total: 0,
        count: 0,
        byType: {},
        average: 0,
      };
    }

    const incomes = artistIncomes.incomes as Income[];
    const byType: Record<string, { count: number; total: number }> = {};

    incomes.forEach(income => {
      const typeDetails = getIncomeTypeDetails(income.type);
      const typeName = typeDetails.name;
      
      if (!byType[typeName]) {
        byType[typeName] = { count: 0, total: 0 };
      }
      byType[typeName].count++;
      byType[typeName].total += income.mount;
    });

    return {
      total: artistIncomes.totalIncome || 0,
      count: incomes.length,
      byType,
      average: incomes.length > 0 ? artistIncomes.totalIncome / incomes.length : 0,
    };
  };

  // Función para preparar datos para la gráfica de tiempo
  const prepareTimeChartData = () => {
    if (!artistIncomes || !artistIncomes.incomes || !startDate || !endDate) {
      return [];
    }

    const incomes = artistIncomes.incomes as Income[];
    
    // Agrupar ingresos por fecha según el intervalo seleccionado
    const groupedData: Record<string, number> = {};
    
    // Crear un array de fechas entre startDate y endDate
    const dateArray: Date[] = [];
    const currentDate = new Date(startDate);
    const endDateObj = new Date(endDate);
    
    while (currentDate <= endDateObj) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Inicializar todas las fechas con 0
    dateArray.forEach(date => {
      let key = '';
      
      switch (timeGroup) {
        case 'day':
          key = date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
          break;
        case 'week':
          const weekNumber = getWeekNumber(date);
          key = `Semana ${weekNumber}`;
          break;
        case 'month':
          key = date.toLocaleDateString('es-ES', { month: 'long' });
          break;
      }
      
      if (!groupedData[key]) {
        groupedData[key] = 0;
      }
    });
    
    // Sumar ingresos por fecha
    incomes.forEach(income => {
      const incomeDate = new Date(income.date);
      let key = '';
      
      switch (timeGroup) {
        case 'day':
          key = incomeDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
          break;
        case 'week':
          const weekNumber = getWeekNumber(incomeDate);
          key = `Semana ${weekNumber}`;
          break;
        case 'month':
          key = incomeDate.toLocaleDateString('es-ES', { month: 'long' });
          break;
      }
      
      if (groupedData[key] !== undefined) {
        groupedData[key] += income.mount;
      }
    });
    
    // Convertir a array y ordenar
    const result = Object.entries(groupedData).map(([name, value]) => ({
      name,
      value,
      date: name // Para referencia
    }));
    
    // Ordenar por fecha
    return result.sort((a, b) => {
      // Para días y meses, ordenar por fecha real
      if (timeGroup === 'day') {
        const dateA = parseDateFromLabel(a.name);
        const dateB = parseDateFromLabel(b.name);
        return dateA.getTime() - dateB.getTime();
      }
      // Para semanas y meses, mantener orden de aparición
      return 0;
    });
  };

  // Función auxiliar para obtener número de semana
  const getWeekNumber = (date: Date): number => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  // Función auxiliar para parsear fecha desde etiqueta
  const parseDateFromLabel = (label: string): Date => {
    try {
      // Asumir formato "DD MMM" para días
      const [day, month] = label.split(' ');
      const monthNames = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
      const monthIndex = monthNames.findIndex(m => m.toLowerCase() === month.toLowerCase());
      const currentYear = new Date().getFullYear();
      return new Date(currentYear, monthIndex, parseInt(day));
    } catch {
      return new Date();
    }
  };

  // Función para preparar datos para la gráfica de pastel (tipos de pago)
  const preparePieChartData = () => {
    const stats = calculateStatistics();
    const pieData = Object.entries(stats.byType).map(([type, data]) => ({
      name: type,
      value: data.total,
      count: data.count,
      percentage: ((data.total / stats.total) * 100).toFixed(1)
    }));

    // Ordenar por valor descendente
    return pieData.sort((a, b) => b.value - a.value);
  };

  // Función para calcular acumulado en el tiempo
  const prepareAccumulatedChartData = () => {
    const timeData = prepareTimeChartData();
    let accumulated = 0;
    
    return timeData.map((item, index) => {
      accumulated += item.value;
      return {
        ...item,
        accumulated,
        index
      };
    });
  };

  // Colores para la gráfica de pastel
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
  // Colores para la gráfica de tiempo
  const TIME_COLORS = {
    line: '#8884d8',
    bar: '#82ca9d',
    area: '#ff8042'
  };

  const stats = calculateStatistics();
  const timeChartData = prepareTimeChartData();
  const pieChartData = preparePieChartData();
  const accumulatedChartData = prepareAccumulatedChartData();

  // Renderizar gráfica según tipo seleccionado
  const renderTimeChart = () => {
    const data = chartType === 'area' ? accumulatedChartData : timeChartData;
    const dataKey = chartType === 'area' ? 'accumulated' : 'value';
    const chartName = chartType === 'area' ? 'Ingresos Acumulados' : 'Ingresos Diarios';

    switch (chartType) {
      case 'line':
        return (
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={TIME_COLORS.line}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name={chartName}
          />
        );
      case 'bar':
        return (
          <Bar
            dataKey={dataKey}
            fill={TIME_COLORS.bar}
            name={chartName}
            radius={[4, 4, 0, 0]}
          />
        );
      case 'area':
        return (
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={TIME_COLORS.area}
            fill={TIME_COLORS.area}
            fillOpacity={0.3}
            strokeWidth={2}
            name={chartName}
          />
        );
      default:
        return null;
    }
  };

  // Funciones para exportar a PDF
  const handleOpenExportDialog = () => {
    if (!artistIncomes || !artistIncomes.incomes || artistIncomes.incomes.length === 0) {
      showNotification("error", "No hay datos para exportar");
      return;
    }
    
    const artistName = getArtistName(selectedArtist).replace(/\s+/g, '-').toLowerCase();
    const dateRange = `${formatDate(startDate!)}_${formatDate(endDate!)}`.replace(/\s+/g, '-');
    setExportOptions({
      ...exportOptions,
      fileName: `reporte-ingresos-${artistName}-${dateRange}`
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
    showNotification("info", "Generando PDF... Esto puede tomar unos segundos.");
    
    // Crear un nuevo documento PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;
    
    let yPos = margin;
    
    // =========== CABECERA DEL REPORTE ===========
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text("Reporte de Ingresos de Artista", pageWidth / 2, yPos, { align: "center" });
    yPos += 10;
    
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Artista: ${getArtistName(selectedArtist)}`, margin, yPos);
    yPos += 6;
    pdf.text(`Período: ${formatDate(startDate!)} - ${formatDate(endDate!)}`, margin, yPos);
    yPos += 6;
    pdf.text(`Total Ingresos: ${formatCurrency(artistIncomes.totalIncome || 0)}`, margin, yPos);
    yPos += 6;
    pdf.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, margin, yPos);
    yPos += 6;
    pdf.text(`Agencia: ${user?.agency || "Sin agencia asignada"}`, margin, yPos);
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
    
    // =========== RESUMEN GENERAL ===========
    if (exportOptions.includeSummary && summaryRef.current) {
      // Agregar título de sección
      addPageIfNeeded(20);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Resumen General", margin, yPos);
      yPos += 8;
      
      // Capturar el elemento
      const canvas = await html2canvas(summaryRef.current, {
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
    
    // =========== ESTADÍSTICAS POR TIPO DE PAGO ===========
    if (exportOptions.includeStatistics && statisticsRef.current) {
      // Agregar título de sección
      addPageIfNeeded(20);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Estadísticas por Tipo de Pago", margin, yPos);
      yPos += 8;
      
      // Capturar el elemento
      const canvas = await html2canvas(statisticsRef.current, {
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
    
    // =========== GRÁFICOS DE ANÁLISIS ===========
    if (exportOptions.includeCharts && chartsRef.current) {
      // Agregar título de sección
      addPageIfNeeded(20);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Análisis Gráfico", margin, yPos);
      yPos += 8;
      
      // Capturar el elemento
      const canvas = await html2canvas(chartsRef.current, {
        scale: 1.0, // Reducir escala para gráficos grandes
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
    
    // =========== DETALLE DE INGRESOS ===========
    if (exportOptions.includeDetails && detailsRef.current) {
      // Agregar título de sección
      addPageIfNeeded(20);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Detalle de Ingresos", margin, yPos);
      yPos += 8;
      
      // Para tablas largas, podemos dividirlas en múltiples capturas
      const tableElement = detailsRef.current;
      const tableHeight = tableElement.offsetHeight;
      
      // Si la tabla es muy alta, capturamos en partes
      if (tableHeight > 1000) {
        // Primera parte de la tabla
        const canvas1 = await html2canvas(tableElement, {
          scale: 0.8,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
          height: 800, // Limitar altura
          windowHeight: 800
        });
        
        let imgData = canvas1.toDataURL('image/png');
        let imgWidth = contentWidth;
        let imgHeight = (canvas1.height * imgWidth) / canvas1.width;
        
        addPageIfNeeded(imgHeight);
        pdf.addImage(imgData, 'PNG', margin, yPos, imgWidth, imgHeight);
        yPos += imgHeight + 10;
        
        // Si necesitamos más páginas para la tabla, podríamos hacer scroll y capturar más
        // Pero por simplicidad, capturamos solo la primera parte
      } else {
        // Tabla normal
        const canvas = await html2canvas(tableElement, {
          scale: 1.0,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        addPageIfNeeded(imgHeight);
        pdf.addImage(imgData, 'PNG', margin, yPos, imgWidth, imgHeight);
        yPos += imgHeight + 10;
      }
    }
    
    // =========== RESUMEN EJECUTIVO ===========
    if (exportOptions.includeExecutiveSummary) {
      addPageIfNeeded(60);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Resumen Ejecutivo", margin, yPos);
      yPos += 10;
      
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      
      const summaryText = [
        `El artista ${getArtistName(selectedArtist)} ha generado un total de ` +
        `${formatCurrency(calculateStatistics().total)} durante el período seleccionado.`,
        `Se registraron ${stats.count} transacciones con un promedio de ` +
        `${formatCurrency(stats.average)} por transacción.`,
        `El período con mayores ingresos fue ` +
        `${timeChartData.reduce((max, item) => item.value > max.value ? item : max).name} con ` +
        `${formatCurrency(Math.max(...timeChartData.map(d => d.value)))}.`
      ];
      
      summaryText.forEach((line, index) => {
        const lines = pdf.splitTextToSize(line, contentWidth);
        addPageIfNeeded(lines.length * 5);
        pdf.text(lines, margin, yPos);
        yPos += lines.length * 5 + 4;
      });
    }
    
    // =========== PIE DE PÁGINA EN TODAS LAS PÁGINAS ===========
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        `Página ${i} de ${totalPages} | ${user?.agency || "Agencia"} | ${new Date().toLocaleDateString('es-ES')}`,
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
    
    showNotification("success", "PDF exportado exitosamente");
  } catch (error) {
    console.error("Error al exportar PDF:", error);
    showNotification("error", "Error al generar el PDF. Por favor, intenta de nuevo.");
  } finally {
    setExporting(false);
  }
};

  // Función para exportar todo el reporte como imagen
  const handleExportFullReport = async () => {
    setExporting(true);
    
    try {
      showNotification("info", "Generando reporte completo...");
      
      if (!reportRef.current) {
        showNotification("error", "No se pudo capturar el reporte");
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
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("Reporte Completo de Ingresos", pageWidth / 2, margin, { align: "center" });
      
      // Agregar imagen
      pdf.addImage(imgData, 'PNG', margin, margin + 10, imgWidth, imgHeight);
      
      // Guardar
      const fileName = `reporte-completo-${getArtistName(selectedArtist).replace(/\s+/g, '-')}-${new Date().getTime()}.pdf`;
      pdf.save(fileName);
      
      showNotification("success", "Reporte completo exportado exitosamente");
    } catch (error) {
      console.error("Error al exportar reporte completo:", error);
      showNotification("error", "Error al generar el reporte completo");
    } finally {
      setExporting(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box ref={reportRef} sx={{ width: "100%", p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Reporte de Ingresos de Artista
          </Typography>
          <Box>
            <Tooltip title="Limpiar">
              <IconButton onClick={handleClear} sx={{ mr: 1 }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            {artistIncomes && artistIncomes.incomes && artistIncomes.incomes.length > 0 && (
              <>
                <Tooltip title="Exportar PDF">
                  <IconButton 
                    onClick={handleOpenExportDialog} 
                    color="primary"
                    disabled={exporting}
                  >
                    {exporting ? <CircularProgress size={24} /> : <PictureAsPdfIcon />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Exportar Reporte Completo">
                  <IconButton 
                    onClick={handleExportFullReport} 
                    color="secondary"
                    disabled={exporting}
                    sx={{ ml: 1 }}
                  >
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        </Box>

        <Snackbar
          open={notification.open}
          autoHideDuration={5000}
          onClose={closeNotification}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={closeNotification} severity={notification.type} variant="filled">
            {notification.message}
          </Alert>
        </Snackbar>

        {incomesError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={clearIncomesError}>
            {incomesError}
          </Alert>
        )}

        
        {/* Panel de control */}
        <Paper sx={{ width: "100%", mb: 3, p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            <EventIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Parámetros del Reporte
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
            <Box sx={{ minWidth: 300, flex: 1 }}>
              <FormControl fullWidth>
                <InputLabel>Seleccionar Artista Activo</InputLabel>
                <Select
                  value={selectedArtist}
                  onChange={(e) => setSelectedArtist(e.target.value)}
                  label="Seleccionar Artista Activo"
                  disabled={incomesLoading || exporting}
                >
                  <MenuItem value="">Selecciona un artista activo</MenuItem>
                  {getActiveArtists().map((artist) => (
                    <MenuItem key={artist.id} value={artist.id}>
                      {artist.stageName || "Sin nombre"} - {artist.status}
                    </MenuItem>
                  ))}
                </Select>
                {getActiveArtists().length === 0 && (
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: "block" }}>
                    No hay artistas activos en esta agencia
                  </Typography>
                )}
              </FormControl>
            </Box>

            <Box sx={{ minWidth: 200, flex: 1 }}>
              <DatePicker
                label="Fecha Inicio"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                format="dd/MM/yyyy"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    disabled: incomesLoading || exporting,
                  },
                }}
              />
            </Box>

            <Box sx={{ minWidth: 200, flex: 1 }}>
              <DatePicker
                label="Fecha Fin"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                format="dd/MM/yyyy"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    disabled: incomesLoading || exporting,
                  },
                }}
              />
            </Box>

            <Box sx={{ minWidth: 150 }}>
              <Button
                variant="contained"
                onClick={handleCalculateIncomes}
                disabled={incomesLoading || !selectedArtist || exporting}
                fullWidth
                sx={{ height: "56px" }}
              >
                {incomesLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <>
                    <AttachMoneyIcon sx={{ mr: 1 }} />
                    Calcular
                  </>
                )}
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Resultados */}
        {artistIncomes && artistIncomes.incomes && (
          <Box sx={{ width: "100%" }}>
            {/* Resumen general */}
            <Paper ref={summaryRef} sx={{ mb: 3, p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Resumen de Ingresos - {getArtistName(selectedArtist)}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Período: {formatDate(startDate!)} - {formatDate(endDate!)}
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mt: 2 }}>
                {/* Tarjeta de Total */}
                <Card sx={{ minWidth: 250, flex: 1, bgcolor: "success.50" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <AttachMoneyIcon sx={{ mr: 1, color: "success.main" }} />
                      <Typography variant="h6">Total Ingresos</Typography>
                    </Box>
                    <Typography variant="h4" sx={{ color: "success.main" }}>
                      {formatCurrency(artistIncomes.totalIncome || 0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {artistIncomes.incomes?.length || 0} transacciones
                    </Typography>
                  </CardContent>
                </Card>

                {/* Tarjeta de Promedio */}
                <Card sx={{ minWidth: 250, flex: 1, bgcolor: "info.50" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <EventIcon sx={{ mr: 1, color: "info.main" }} />
                      <Typography variant="h6">Promedio por Transacción</Typography>
                    </Box>
                    <Typography variant="h4" sx={{ color: "info.main" }}>
                      {formatCurrency(stats.average || 0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Distribución por tipo de pago
                    </Typography>
                  </CardContent>
                </Card>

                {/* Tarjeta de Tipos de Pago */}
                <Card sx={{ minWidth: 250, flex: 1, bgcolor: "warning.50" }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Tipos de Pago
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                      {Object.entries(stats.byType).map(([type, data]) => (
                        <Chip
                          key={type}
                          label={`${type}: ${data.count}`}
                          color={getPaymentTypeColor(type) as any}
                          size="small"
                          icon={getPaymentTypeIcon(type)}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Paper>

            {/* Detalle de ingresos */}
            {artistIncomes.incomes.length > 0 && (
              <Paper ref={detailsRef} sx={{ mb: 3, p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                  Detalle de Ingresos
                </Typography>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "primary.50" }}>
                        <TableCell><strong>Actividad</strong></TableCell>
                        <TableCell><strong>Fecha</strong></TableCell>
                        <TableCell><strong>Tipo de Pago</strong></TableCell>
                        <TableCell><strong>Detalles del Tipo</strong></TableCell>
                        <TableCell align="right"><strong>Monto</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {artistIncomes.incomes.map((income: Income, index: number) => {
                        const activityDetails = getActivityDetails(income.activityId);
                        const incomeTypeDetails = getIncomeTypeDetails(income.type);
                        
                        return (
                          <TableRow key={index} hover>
                           
                            <TableCell>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                                  {activityDetails.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {activityDetails.type}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {formatDate(income.date)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={incomeTypeDetails.name}
                                color={getPaymentTypeColor(income.type) as any}
                                size="small"
                                icon={getPaymentTypeIcon(income.type)}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {incomeTypeDetails.description}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                {formatCurrency(income.mount)}
                              </Typography>
                            </TableCell>
                            
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Total al final de la tabla */}
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, pt: 2, borderTop: "1px solid #e0e0e0" }}>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="h6">Total General</Typography>
                    <Typography variant="h4" sx={{ color: "success.main", fontWeight: "bold" }}>
                      {formatCurrency(artistIncomes.totalIncome)}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            )}

            {/* Estadísticas detalladas */}
            <Paper ref={statisticsRef} sx={{ p: 3, bgcolor: "grey.50", mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Estadísticas Detalladas por Tipo de Pago
              </Typography>
              
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mt: 2 }}>
                {Object.entries(stats.byType).map(([type, data]) => (
                  <Card key={type} sx={{ minWidth: 200, flex: 1 }}>
                    <CardContent>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        {getPaymentTypeIcon(type)}
                        <Typography variant="h6" sx={{ ml: 1 }}>
                          {type}
                        </Typography>
                      </Box>
                      <Typography variant="h5" sx={{ color: "primary.main" }}>
                        {formatCurrency(data.total)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {data.count} transacciones ({((data.count / stats.count) * 100).toFixed(1)}%)
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {((data.total / stats.total) * 100).toFixed(1)}% del total
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Paper>

            {/* Gráficas */}
            {timeChartData.length > 0 && (
              <Paper ref={chartsRef} sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Evolución de Ingresos en el Tiempo
                  </Typography>
                  
                  <Box sx={{ display: "flex", gap: 2 }}>
                    {/* Selector de tipo de gráfico */}
                    <ToggleButtonGroup
                      value={chartType}
                      exclusive
                      onChange={(_, newValue) => newValue && setChartType(newValue)}
                      size="small"
                    >
                      <ToggleButton value="line">
                        <Tooltip title="Gráfico de Línea">
                          <ShowChartIcon />
                        </Tooltip>
                      </ToggleButton>
                      <ToggleButton value="bar">
                        <Tooltip title="Gráfico de Barras">
                          <BarChartIcon />
                        </Tooltip>
                      </ToggleButton>
                      <ToggleButton value="area">
                        <Tooltip title="Gráfico de Área Acumulada">
                          <TimelineIcon />
                        </Tooltip>
                      </ToggleButton>
                    </ToggleButtonGroup>

                    {/* Selector de agrupación temporal */}
                    <ToggleButtonGroup
                      value={timeGroup}
                      exclusive
                      onChange={(_, newValue) => newValue && setTimeGroup(newValue)}
                      size="small"
                    >
                      <ToggleButton value="day">
                        <Tooltip title="Agrupar por Día">
                          <CalendarTodayIcon />
                        </Tooltip>
                      </ToggleButton>
                      <ToggleButton value="week">
                        <Tooltip title="Agrupar por Semana">
                          <EventIcon />
                        </Tooltip>
                      </ToggleButton>
                      <ToggleButton value="month">
                        <Tooltip title="Agrupar por Mes">
                          <CalendarTodayIcon />
                        </Tooltip>
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Box>
                </Box>
                
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mt: 2 }}>
                  {/* Gráfica de tiempo */}
                  <Box sx={{ flex: 1, minWidth: 600, height: 400 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {chartType === 'area' ? 'Ingresos Acumulados' : 'Ingresos por Período'} ({timeGroup === 'day' ? 'Día' : timeGroup === 'week' ? 'Semana' : 'Mes'})
                    </Typography>
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === 'line' ? (
                        <LineChart
                          data={timeChartData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="name" 
                            angle={-45}
                            textAnchor="end"
                            height={60}
                          />
                          <YAxis 
                            tickFormatter={(value: number) => formatCurrency(value).replace('€', '')} 
                          />
                          {/* <ChartTooltip 
                            formatter={(value: any) => [formatCurrency(Number(value)), chartType === 'area' ? 'Acumulado' : 'Ingresos']}
                            labelFormatter={(label: any) => `Período: ${label}`}
                          /> */}
                          <Legend />
                          {renderTimeChart()}
                        </LineChart>
                      ) : chartType === 'bar' ? (
                        <BarChart
                          data={timeChartData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="name" 
                            angle={-45}
                            textAnchor="end"
                            height={60}
                          />
                          <YAxis 
                            tickFormatter={(value: number) => formatCurrency(value).replace('€', '')} 
                          />
                          <ChartTooltip 
                            formatter={(value: any) => [formatCurrency(Number(value)), 'Ingresos']}
                            labelFormatter={(label: any) => `Período: ${label}`}
                          />
                          <Legend />
                          {renderTimeChart()}
                        </BarChart>
                      ) : (
                        <AreaChart
                          data={accumulatedChartData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="name" 
                            angle={-45}
                            textAnchor="end"
                            height={60}
                          />
                          <YAxis 
                            tickFormatter={(value: number) => formatCurrency(value).replace('€', '')} 
                          />
                          <ChartTooltip 
                            formatter={(value: any) => [formatCurrency(Number(value)), 'Acumulado']}
                            labelFormatter={(label: any) => `Período: ${label}`}
                          />
                          <Legend />
                          {renderTimeChart()}
                        </AreaChart>
                      )}
                    </ResponsiveContainer>
                    
                    
                  </Box>

                  {/* Gráfica de pastel (distribución por tipo) */}
                  <Box sx={{ flex: 1, minWidth: 400, height: 400 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Distribución por Tipo de Pago
                    </Typography>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent? percent * 100 : 0).toFixed(0)}%`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip 
                          formatter={(value: any) => [formatCurrency(Number(value)), 'Ingresos']}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                    
                    
                  </Box>
                </Box>
              </Paper>
            )}

            
          </Box>
        )}

        {/* Estado vacío */}
        {!artistIncomes && !incomesLoading && (
          <Box sx={{ textAlign: "center", py: 8, bgcolor: "grey.50", borderRadius: 2, mt: 3 }}>
            <AttachMoneyIcon sx={{ fontSize: 60, color: "grey.400", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No hay datos de ingresos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Selecciona un artista activo y un período de tiempo para calcular los ingresos.
            </Typography>
          </Box>
        )}
      </Box>

      {/* Diálogo de opciones de exportación */}
      <Dialog open={exportDialogOpen} onClose={handleCloseExportDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h6">
              <PictureAsPdfIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Exportar a PDF
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
                    <Typography variant="body1">Resumen General</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tarjetas de resumen, totales y tipos de pago
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            
            <ListItem>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={exportOptions.includeStatistics}
                    onChange={(e) => setExportOptions({...exportOptions, includeStatistics: e.target.checked})}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1">Estadísticas por Tipo de Pago</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Distribución detallada por cada tipo de pago
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            
            <ListItem>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={exportOptions.includeCharts}
                    onChange={(e) => setExportOptions({...exportOptions, includeCharts: e.target.checked})}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1">Gráficos de Análisis</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Gráficos de evolución temporal y distribución
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            
            <ListItem>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={exportOptions.includeDetails}
                    onChange={(e) => setExportOptions({...exportOptions, includeDetails: e.target.checked})}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1">Detalle de Ingresos</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tabla completa con todas las transacciones
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
    </LocalizationProvider>
  );
};

export default ArtistIncomeReportView;