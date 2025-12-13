import React, { useState, useEffect } from "react";
import CustomAutocomplete from "./CustomAutocomplete";
import FormTextField from "./FormTextField";
import { Icon } from "../../icons";
import '../datatable.css'

// Importar Material-UI components
import {
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
} from '@mui/material';

export interface FormField {
  name: string;
  label: string;
  type: "text" | "number" | "date" | "select" | "email" | "password" | "textarea" | "checkbox" | "autocomplete" | "radio";
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
  options?: Array<{ value: string | number; label: string }>;
  rows?: number;
  disabled?: boolean;
  multiple?: boolean; 
  validate?: (value: any, formData?: Record<string, any>) => string | null;
}

export interface CreateModalProps {
  title: string;
  fields: FormField[];
  initialData: Record<string, any>;
  onSubmit: (data: Record<string, any>) => Promise<void> | void;
  onClose: () => void;
  loading?: boolean;
  error?: string;
  submitText?: string;
  cancelText?: string;
}

const CreateModal: React.FC<CreateModalProps> = ({
  title,
  fields,
  initialData,
  onSubmit,
  onClose,
  loading = false,
  error,
  submitText = "Crear",
  cancelText = "Cancelar"
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

    // Clear validation error for this field
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
    // if (field.type === "number") {
    //   const numValue = Number(value);
    //   if (field.min !== undefined && numValue < field.min) {
    //     return `${field.label} debe ser mayor o igual a ${field.min}`;
    //   }
    //   if (field.max !== undefined && numValue > field.max) {
    //     return `${field.label} debe ser menor o igual a ${field.max}`;
    //   }
    // }

    // if (field.type === "date") {
    //   const dateValue = new Date(value);
    //   const today = new Date();
    //   if (dateValue > today) {
    //     return `${field.label} no puede ser futura`;
    //   }
    // }

    // Custom validation
    if (field.validate) {
      return field.validate(value);
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

    await onSubmit(formData);
  };

  const renderField = (field: FormField) => {
    const { name, label, type, required, options = [], placeholder, disabled, min, max, rows } = field;
    const value = formData[name] || '';
    const error = validationErrors[name] || '';

    switch (type) {
      case 'autocomplete':
        return (
          <div key={name} className="form-group">
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
            />
          </div>
        );

      case 'select':
        return (
          <div key={name} className="form-group">
            <FormControl fullWidth error={!!error} required={required} margin="normal">
              <InputLabel id={`${name}-label`}>{label}</InputLabel>
              <Select
                labelId={`${name}-label`}
                value={value}
                label={label}
                onChange={(e) => handleChange(name, e.target.value)}
                disabled={disabled || loading}
                size="small"
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
          </div>
        );

      case 'textarea':
        return (
          <div key={name} className="form-group">
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
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                marginTop: '16px',
                marginBottom: '8px',
                '& .MuiInputLabel-root': {
                  backgroundColor: 'white',
                  padding: '0 4px',
                  transform: 'translate(14px, -6px) scale(0.75)',
                },
                '& .MuiOutlinedInput-root': {
                  marginTop: '8px',
                }
              }}
            />
          </div>
        );

      case 'checkbox':
        return (
          <div key={name} className="form-group">
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!value}
                  onChange={(e) => handleChange(name, e.target.checked)}
                  disabled={disabled || loading}
                  color="primary"
                />
              }
              label={label}
              required={required}
            />
            {error && <FormHelperText error>{error}</FormHelperText>}
          </div>
        );

      case 'radio':
        return (
          <div key={name} className="form-group">
            <FormLabel component="legend" required={required}>{label}</FormLabel>
            <RadioGroup
              value={value}
              onChange={(e) => handleChange(name, e.target.value)}
              row
            >
              {options.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio disabled={disabled || loading} />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {error && <FormHelperText error>{error}</FormHelperText>}
          </div>
        );

      case 'date':
        const dateMin = name === "endDate" && formData.startDate 
          ? formData.startDate 
          : undefined;
        
        return (
          <div key={name} className="form-group">
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
              InputLabelProps={{
                shrink: true,
              }}
              min={dateMin}
            />
          </div>
        );

      default:
        // Para los tipos nativos que sí soporta FormTextField
        const allowedTypes = ["text", "number", "email", "password"];
        const safeType = allowedTypes.includes(type) ? type as "text" | "number" | "email" | "password" : "text";
        
        return (
          <div key={name} className="form-group">
            <FormTextField
              name={name}
              label={label}
              value={value}
              onChange={handleChange}
              type={safeType}
              error={!!error}
              helperText={error}
              required={required}
              placeholder={placeholder}
              disabled={disabled || loading}
              min={min}
              max={max}
              variant="outlined"
              fullWidth
            />
          </div>
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
      <div className="modal-content">
        <h3>{title}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
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
                  Procesando...
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

export default CreateModal;