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

// Definir el enum de roles de artista
export enum ArtistRole {
  LIDER = "LIDER",
  VOCALISTA = "VOCALISTA", 
  RAPERO = "RAPERO",
  BAILARIN = "BAILARIN",
  VISUAL = "VISUAL",
  MAKNAE = "MAKNAE"
}

interface Trainee {
  id: string;
  name: string;
  lastName: string;
  artistId?: string;
  fullName: string;
}

interface AddMemberModalProps {
  group: GroupResponseDto;
  trainees: Trainee[];
  onClose: () => void;
  onAddMember: (traineeId: string, role: ArtistRole, endDate?: Date) => Promise<void>;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({
  group,
  trainees,
  onClose,
  onAddMember,
}) => {
  const [selectedTrainee, setSelectedTrainee] = useState<Trainee | null>(null);
  const [role, setRole] = useState<ArtistRole | "">("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Mapeo de roles para mostrar en español
  const roleOptions = [
    { value: ArtistRole.LIDER, label: "Lider" },
    { value: ArtistRole.VOCALISTA, label: "Vocalista" },
    { value: ArtistRole.RAPERO, label: "Rapero" },
    { value: ArtistRole.BAILARIN, label: "Bailarín" },
    { value: ArtistRole.VISUAL, label: "Visual" },
    { value: ArtistRole.MAKNAE, label: "Maknae" },
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
        role as ArtistRole,
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
            onChange={(e) => setRole(e.target.value as ArtistRole)}
            fullWidth
            required
            sx={{ mt: 3 }}
          >
            <MenuItem value="">
              <em>Seleccione un rol</em>
            </MenuItem>
            {roleOptions.map((roleOption) => (
              <MenuItem key={roleOption.value} value={roleOption.value}>
                {roleOption.label}
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

          {/* Información adicional sobre los roles */}
          <Paper sx={{ p: 2, mt: 3, bgcolor: 'info.light' }}>
            <Typography variant="body2" color="info.dark" sx={{ mb: 1 }}>
              <strong>Información sobre roles:</strong>
            </Typography>
            <Typography variant="caption" color="info.dark">
              <strong>Líder:</strong> Responsable del grupo<br />
              <strong>Vocalista:</strong> Especializado en canto<br />
              <strong>Rapero:</strong> Especializado en rap<br />
              <strong>Bailarín:</strong> Especializado en baile<br />
              <strong>Visual:</strong> Centro visual del grupo<br />
              <strong>Maknae:</strong> Miembro más joven del grupo
            </Typography>
          </Paper>
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