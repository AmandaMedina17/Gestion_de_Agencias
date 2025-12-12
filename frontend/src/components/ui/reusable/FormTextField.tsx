import * as React from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { FormControl, FormHelperText } from '@mui/material';

interface FormTextFieldProps extends Omit<TextFieldProps, 'onChange'> {
  name: string;
  label: string;
  value: string | number;
  onChange: (name: string, value: string) => void;
  error?: boolean;
  helperText?: string;
  type?: 'text' | 'number' | 'date' | 'email' | 'tel' | 'password' | 'url';
  required?: boolean;
  min?: number;
  max?: number;
  placeholder?: string;
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
  shrinkLabel?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium';
}

const FormTextField: React.FC<FormTextFieldProps> = ({
  name,
  label,
  value,
  onChange,
  error = false,
  helperText = '',
  type = 'text',
  required = false,
  min,
  max,
  placeholder = '',
  fullWidth = true,
  multiline = false,
  rows = 4,
  shrinkLabel = false,
  disabled = false,
  size = 'small',
  variant = 'outlined',
  ...textFieldProps
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(name, event.target.value);
  };

  // Configuración específica por tipo
  const getInputProps = () => {
    const props: any = {};

    if (type === 'number') {
      if (min !== undefined) props.min = min;
      if (max !== undefined) props.max = max;
    }

    if (type === 'date') {
      props.shrink = shrinkLabel || value !== '';
    }

    return props;
  };

  return (
    <FormControl 
      fullWidth={fullWidth} 
      error={error} 
      required={required}
      margin="normal"
    >
      <TextField
        {...textFieldProps}
        name={name}
        label={label}
        value={value}
        onChange={handleChange}
        type={type}
        variant={variant}
        size={size}
        placeholder={placeholder}
        error={error}
        helperText={helperText}
        required={required}
        disabled={disabled}
        multiline={multiline}
        rows={rows}
        fullWidth={fullWidth}
        InputLabelProps={getInputProps()}
        inputProps={{
          min,
          max,
          step: type === 'number' ? 1 : undefined,
          // ELIMINA esta línea que restringe las fechas futuras:
          // ...(type === 'date' && {
          //   max: new Date().toISOString().split('T')[0],
          // }),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            height: size === 'small' ? '40px' : '56px',
          },
          '& .MuiInputLabel-root': {
            transform: 'translate(14px, 9px) scale(1)',
          },
          '& .MuiInputLabel-shrink': {
            transform: 'translate(14px, -9px) scale(0.75)',
          },
        }}
      />
    </FormControl>
  );
};

export default FormTextField;