import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  CircularProgress,
  Alert,
  Typography,
  Box,
} from '@mui/material';
import { useAgency } from '../../../context/AgencyContext';
import { useArtist } from '../../../context/ArtistContext';
import { ArtistResponseDto } from '../../../../../backend/src/ApplicationLayer/DTOs/artistDto/response-artist.dto';
import { CreateArtistAgencyDto } from '../../../../../backend/src/ApplicationLayer/DTOs/artist_agencyDto/create-artist-agency.dto';

interface AddArtistToAgencyModalProps {
  open: boolean;
  onClose: () => void;
  agencyId: string;
  agencyName: string;
  onArtistAdded: () => void;
}

const AddArtistToAgencyModal: React.FC<AddArtistToAgencyModalProps> = ({
  open,
  onClose,
  agencyId,
  agencyName,
  onArtistAdded,
}) => {
  const { addArtistToAgency, loading, error, clearError, fetchAllArtists } = useAgency();
  const { artists: allArtistsFromContext, fetchArtists } = useArtist();
  
  const [selectedArtist, setSelectedArtist] = useState<ArtistResponseDto | null>(null);
  const [availableArtists, setAvailableArtists] = useState<ArtistResponseDto[]>([]);
  const [searchText, setSearchText] = useState('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [localLoading, setLocalLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Cargar artistas disponibles cuando se abre el modal
  useEffect(() => {
    if (open) {
      loadAvailableArtists();
      // Establecer fecha de inicio por defecto (hoy)
      const today = new Date().toISOString().split('T')[0];
      setStartDate(today);
    }
  }, [open]);

  const loadAvailableArtists = async () => {
    setLocalLoading(true);
    try {
      let allArtists: ArtistResponseDto[] = [];
      
      if (fetchAllArtists) {
        allArtists = await fetchAllArtists();
      } else {
        await fetchArtists();
        allArtists = allArtistsFromContext;
      }
      
      setAvailableArtists(allArtists);
    } catch (err) {
      console.error('Error cargando artistas:', err);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedArtist || !startDate) {
      showNotification('error', 'Por favor selecciona un artista y una fecha de inicio');
      return;
    }

    // Validar que la fecha de inicio sea válida
    const startDateObj = new Date(startDate);
    if (isNaN(startDateObj.getTime())) {
      showNotification('error', 'La fecha de inicio no es válida');
      return;
    }

    try {
      // Crear el DTO con validación para endDate
      const createArtistAgencyDto: CreateArtistAgencyDto = {
        artistid: selectedArtist.id,
        startDate: startDateObj,
      };

      // Solo agregar endDate si tiene valor y es una fecha válida
      if (endDate && endDate.trim() !== '') {
        const endDateObj = new Date(endDate);
        if (!isNaN(endDateObj.getTime())) {
          // Validar que la fecha de fin sea posterior o igual a la fecha de inicio
          if (endDateObj < startDateObj) {
            showNotification('error', 'La fecha de fin debe ser posterior o igual a la fecha de inicio');
            return;
          }
          createArtistAgencyDto.endDate = endDateObj;
        } else {
          showNotification('error', 'La fecha de fin no es válida');
          return;
        }
      }

      console.log('Enviando DTO:', createArtistAgencyDto);
      
      await addArtistToAgency(agencyId, createArtistAgencyDto);
      
      setSuccessMessage(`Artista ${selectedArtist.stageName} agregado exitosamente a ${agencyName}`);
      
      // Limpiar el formulario
      setSelectedArtist(null);
      setSearchText('');
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate('');
      
      // Notificar al componente padre
      onArtistAdded();
      
      // Cerrar automáticamente después de 2 segundos
      setTimeout(() => {
        onClose();
        setSuccessMessage(null);
      }, 2000);
    } catch (err: any) {
      console.error('Error al agregar artista:', err);
      // El error ya está manejado por el contexto
    }
  };

  const handleClose = () => {
    setSelectedArtist(null);
    setSearchText('');
    setSuccessMessage(null);
    setStartDate('');
    setEndDate('');
    clearError();
    onClose();
  };

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    // Puedes implementar un sistema de notificaciones global aquí
    alert(message);
  };

  const filteredArtists = availableArtists.filter(artist =>
    artist.stageName?.toLowerCase().includes(searchText.toLowerCase()) ||
    artist.id.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Agregar Artista a {agencyName}
      </DialogTitle>
      
      <DialogContent>
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
            {error}
          </Alert>
        )}
        
        <Typography variant="body2" color="text.secondary" paragraph>
          Selecciona un artista para agregarlo a esta agencia. Debes proporcionar una fecha de inicio.
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          <Autocomplete
            options={filteredArtists}
            getOptionLabel={(option) => `${option.stageName} (ID: ${option.id.substring(0, 8)}...)`}
            value={selectedArtist}
            onChange={(_, newValue) => setSelectedArtist(newValue)}
            inputValue={searchText}
            onInputChange={(_, newInputValue) => setSearchText(newInputValue)}
            loading={localLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Buscar artista"
                variant="outlined"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {localLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props}>
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    {option.stageName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ID: {option.id.substring(0, 8)}... • Estado: {option.status}
                  </Typography>
                  {option.birthday && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      Edad: {calculateAge(option.birthday)} años
                    </Typography>
                  )}
                </Box>
              </li>
            )}
            noOptionsText="No se encontraron artistas"
          />
          
          {selectedArtist && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Información del artista seleccionado:
              </Typography>
              <Typography variant="body2">
                <strong>Nombre artístico:</strong> {selectedArtist.stageName}
              </Typography>
              <Typography variant="body2">
                <strong>Estado:</strong> {selectedArtist.status}
              </Typography>
              {selectedArtist.birthday && (
                <Typography variant="body2">
                  <strong>Edad:</strong> {calculateAge(selectedArtist.birthday)} años
                </Typography>
              )}
            </Box>
          )}

          <Box sx={{ mt: 3 }}>
            <TextField
              label="Fecha de inicio *"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              required
              error={!startDate}
              helperText={!startDate ? "La fecha de inicio es obligatoria" : ""}
            />
            <TextField
              label="Fecha de fin (opcional)"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              helperText="Deja este campo vacío si no hay fecha de fin definida"
            />
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={!selectedArtist || !startDate || loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Agregando...' : 'Agregar Artista'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Funciones auxiliares
const calculateAge = (birthday: Date | string): number => {
  if (!birthday) return 0;
  try {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  } catch {
    return 0;
  }
};

export default AddArtistToAgencyModal;