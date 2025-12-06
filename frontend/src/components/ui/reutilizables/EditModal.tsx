import React, { useState, useEffect } from "react";
import CustomAutocomplete from "./CustomAutocomplete";
import FormTextField from "./FormTextField";
import { Icon } from "../../icons";
import { FormField } from "./CreateModal";
import '../datatable.css'

// Importar Material-UI components
import {
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Box,
  Typography,
  Paper,
} from '@mui/material';

export interface EditModalProps {
  title: string;
  fields: FormField[];
  initialData: Record<string, any>;
  itemId: string | number;
  onSubmit: (id: string | number, data: Record<string, any>) => Promise<void> | void;
  onClose: () => void;
  loading?: boolean;
  error?: string;
  submitText?: string;
  cancelText?: string;
  denseSpacing?: boolean;
  // Nueva prop para información del contrato
  contractInfo?: {
    artist: string;
    agency: string;
  };
}

const EditModal: React.FC<EditModalProps> = ({
  title,
  fields,
  initialData,
  itemId,
  onSubmit,
  onClose,
  loading = false,
  error,
  submitText = "Actualizar",
  cancelText = "Cancelar",
  denseSpacing = true,
  contractInfo,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(initialData);
    setValidationErrors({});
  }, [initialData]);

  const handleChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

    if (validationErrors[fieldName]) {
      setValidationErrors(prev => ({
        ...prev,
        [fieldName]: ""
      }));
    }
  };

  const validateField = (field: FormField, value: any, formData: Record<string, any>): string | null => {
    // Required validation
    if (field.required && (value === "" || value === null || value === undefined)) {
      return `${field.label} es requerido`;
    }

    // Type-specific validations
    if (field.type === "number") {
      const numValue = Number(value);
      if (field.min !== undefined && numValue < field.min) {
        return `${field.label} debe ser mayor o igual a ${field.min}`;
      }
      if (field.max !== undefined && numValue > field.max) {
        return `${field.label} debe ser menor o igual a ${field.max}`;
      }
    }

    // Custom validation
    if (field.validate) {
      return field.validate(value, formData);
    }

    return null;
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    let isValid = true;

    fields.forEach(field => {
      const error = validateField(field, formData[field.name], formData);
      if (error) {
        errors[field.name] = error;
        isValid = false;
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await onSubmit(itemId, formData);
  };

  const renderField = (field: FormField) => {
    const { name, label, type, required, options = [], placeholder, disabled, min, max, rows } = field;
    const value = formData[name] || '';
    const error = validationErrors[name] || '';
    const size = 'small';

    const fieldStyle = {
      marginBottom: denseSpacing ? '8px' : '16px',
    };

    switch (type) {
      case 'autocomplete':
        return (
          <Box key={name} sx={fieldStyle}>
            <CustomAutocomplete
              label={label}
              value={value}
              onChange={(newValue) => handleChange(name, newValue)}
              options={options}
              required={required}
              error={!!error}
              helperText={error}
              disabled={disabled || loading}
              placeholder={placeholder}
              size={size}
            />
          </Box>
        );

      case 'select':
        return (
          <Box key={name} sx={fieldStyle}>
            <FormControl 
              fullWidth 
              error={!!error} 
              required={required} 
              size={size}
              sx={{ 
                marginTop: '0px',
                marginBottom: '0px',
              }}
            >
              <InputLabel id={`${name}-label`}>{label}</InputLabel>
              <Select
                labelId={`${name}-label`}
                value={value}
                label={label}
                onChange={(e) => handleChange(name, e.target.value)}
                disabled={disabled || loading}
                sx={{
                  height: '40px',
                }}
              >
                <MenuItem value="">
                  <em>Seleccione una opción</em>
                </MenuItem>
                {options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {error && <FormHelperText error>{error}</FormHelperText>}
            </FormControl>
          </Box>
        );

      case 'textarea':
        return (
          <Box key={name} sx={fieldStyle}>
            <TextField
              label={label}
              value={value}
              onChange={(e) => handleChange(name, e.target.value)}
              multiline
              rows={rows || 4}
              variant="outlined"
              disabled={disabled || loading}
              error={!!error}
              helperText={error}
              required={required}
              placeholder={placeholder}
              fullWidth
              size={size}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                marginTop: '0px',
                marginBottom: '0px',
                '& .MuiInputLabel-root': {
                  backgroundColor: 'white',
                  padding: '0 4px',
                }
              }}
            />
          </Box>
        );

      case 'date':
        const dateMin = name === "endDate" && formData.startDate 
          ? formData.startDate 
          : undefined;
        
        return (
          <Box key={name} sx={fieldStyle}>
            <FormTextField
              name={name}
              label={label}
              value={value}
              onChange={handleChange}
              type="date"
              error={!!error}
              helperText={error}
              required={required}
              disabled={disabled || loading}
              shrinkLabel={true}
              variant="outlined"
              fullWidth
              size={size}
              min={dateMin}
              sx={{
                marginTop: '0px',
                marginBottom: '0px',
                '& .MuiInputLabel-root': {
                  backgroundColor: 'white',
                  padding: '0 4px',
                }
              }}
            />
          </Box>
        );

      default:
        return (
          <Box key={name} sx={fieldStyle}>
            <FormTextField
              name={name}
              label={label}
              value={value}
              onChange={handleChange}
              type={type}
              error={!!error}
              helperText={error}
              required={required}
              placeholder={placeholder}
              disabled={disabled || loading}
              min={min}
              max={max}
              variant="outlined"
              fullWidth
              size={size}
              sx={{
                marginTop: '0px',
                marginBottom: '0px',
                '& .MuiInputLabel-root': {
                  backgroundColor: 'white',
                  padding: '0 4px',
                }
              }}
            />
          </Box>
        );
    }
  };

  const isFormValid = fields.every(field => {
    if (!field.required) return true;
    const value = formData[field.name];
    return value !== "" && value !== null && value !== undefined;
  });

  return (
    <div className="modal-overlay">
      <div className="modal-content dense-form">
        <h3>{title}</h3>
        
        {/* Información del contrato (solo lectura) */}
        {contractInfo && (
          <Paper 
            elevation={1} 
            sx={{ 
              p: 2, 
              mb: 3, 
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Información del Contrato
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ minWidth: '100px', fontWeight: 'medium' }}>
                  Artista:
                </Typography>
                <Typography variant="body2" sx={{ ml: 2 }}>
                  {contractInfo.artist}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ minWidth: '100px', fontWeight: 'medium' }}>
                  Agencia:
                </Typography>
                <Typography variant="body2" sx={{ ml: 2 }}>
                  {contractInfo.agency}
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ mt: 1, fontStyle: 'italic', color: '#666' }}>
                Nota: No se puede cambiar la agencia o artista en un contrato existente. 
                Para cambiar estos datos, debe crear un nuevo contrato.
              </Typography>
            </Box>
          </Paper>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid dense">
            {fields.map(renderField)}
          </div>
          
          {error && (
            <div className="message error">
              {error}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="submit"
              className="submit-button"
              disabled={loading || !isFormValid}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Actualizando...
                </>
              ) : (
                <>
                  <Icon name="check" size={18} />
                  {submitText}
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
              {cancelText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;