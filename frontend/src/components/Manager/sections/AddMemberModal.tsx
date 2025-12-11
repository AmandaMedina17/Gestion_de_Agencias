import React, { useState } from "react";
import { GroupResponseDto } from "../../../../../backend/src/ApplicationLayer/DTOs/groupDto/response-group.dto";
import { Icon } from "../../icons";
import {
  Box,
  Typography,
  Paper,
  Autocomplete,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';

interface Trainee {
  id: string;
  name: string;
  lastName: string;
  artistId?: string;
  // otros campos del aprendiz
}

interface AddMemberModalProps {
  group: GroupResponseDto;
  trainees: Trainee[];
  onClose: () => void;
  onAddMember: (traineeId: string, role: string, endDate?: Date) => Promise<void>;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({
  group,
  trainees,
  onClose,
  onAddMember,
}) => {
  const [selectedTrainee, setSelectedTrainee] = useState<Trainee | null>(null);
  const [role, setRole] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const roles = [
    "Vocalista Principal",
    "Vocalista",
    "Rapero Principal",
    "Rapero",
    "Bailarín Principal",
    "Bailarín",
    "Líder",
    "Maknae",
    "Centro Visual",
  ];

  const handleSubmit = async () => {
    if (!selectedTrainee || !role) {
      alert("Por favor, seleccione un aprendiz y especifique un rol");
      return;
    }

    setLoading(true);
    try {
      await onAddMember(
        selectedTrainee.id,
        role,
        endDate ? new Date(endDate) : undefined
      );
      onClose();
    } catch (error) {
      console.error("Error al agregar miembro:", error);
    } finally {
      setLoading(false);
    }
  };

  const traineeOptions = trainees.map(trainee => ({
    value: trainee.id,
    label: `${trainee.name} ${trainee.lastName} ${trainee.artistId ? "(Ya tiene artista)" : "(Sin artista)"}`,
    hasArtist: !!trainee.artistId,
    trainee
  }));

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: "600px" }}>
        <div className="modal-header">
          <h3>Añadir Miembro a {group.name}</h3>
          <button className="close-btn" onClick={onClose}>
            <Icon name="close" size={20} />
          </button>
        </div>

        <Box sx={{ mt: 2 }}>
          <Autocomplete
            options={traineeOptions}
            getOptionLabel={(option) => option.label}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography>
                    {option.label}
                  </Typography>
                  {!option.hasArtist && (
                    <Box
                      sx={{
                        ml: 1,
                        fontSize: '0.75rem',
                        color: 'warning.main',
                        bgcolor: 'warning.light',
                        px: 1,
                        py: 0.25,
                        borderRadius: 1
                      }}
                    >
                      Crear artista necesario
                    </Box>
                  )}
                </Box>
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Seleccionar Aprendiz"
                variant="outlined"
                fullWidth
                required
              />
            )}
            onChange={(event, newValue) => {
              setSelectedTrainee(newValue?.trainee || null);
            }}
            isOptionEqualToValue={(option, value) => option.value === value.value}
          />

          <TextField
            select
            label="Rol en el Grupo"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            fullWidth
            required
            sx={{ mt: 3 }}
          >
            <MenuItem value="">
              <em>Seleccione un rol</em>
            </MenuItem>
            {roles.map((roleOption) => (
              <MenuItem key={roleOption} value={roleOption}>
                {roleOption}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Fecha de Finalización (Opcional)"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ mt: 3 }}
            helperText="Dejar vacío si es miembro actual"
          />

          {selectedTrainee && !selectedTrainee.artistId && (
            <Paper sx={{ p: 2, mt: 3, bgcolor: 'warning.light' }}>
              <Typography variant="body2" color="warning.dark">
                <strong>Nota:</strong> Este aprendiz no tiene un artista asociado. 
                Al proceder, se creará automáticamente un artista basado en este aprendiz.
              </Typography>
            </Paper>
          )}
        </Box>

        <div className="modal-actions" style={{ marginTop: "20px" }}>
          <button
            type="button"
            className="submit-button"
            onClick={handleSubmit}
            disabled={loading || !selectedTrainee || !role}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Procesando...
              </>
            ) : (
              <>
                <Icon name="user" size={18} />
                {selectedTrainee?.artistId ? "Agregar al Grupo" : "Crear Artista y Agregar"}
              </>
            )}
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={onClose}
            disabled={loading}
          >
            <Icon name="close" size={18} />
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;