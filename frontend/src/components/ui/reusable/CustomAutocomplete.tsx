// components/ui/CustomAutocomplete.tsx
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { FormControl, FormHelperText } from '@mui/material';

interface CustomAutocompleteProps {
  label: string;
  value: any;
  onChange: (value: any) => void;
  options: Array<{ value: any; label: string }>;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  placeholder?: string;
  size?: 'small' | 'medium';
}

const CustomAutocomplete: React.FC<CustomAutocompleteProps> = ({
  label,
  value,
  onChange,
  options,
  required = false,
  error = false,
  helperText = '',
  disabled = false,
  placeholder = '',
  size = 'small', // Tamaño por defecto pequeño
}) => {
  // Encuentra la opción correspondiente al valor actual
  const selectedOption = options.find(option => option.value === value) || null;

  return (
    <FormControl fullWidth error={error} required={required} margin="normal">
      <Autocomplete
        value={selectedOption}
        onChange={(event, newValue) => {
          onChange(newValue ? newValue.value : '');
        }}
        options={options}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.value === value?.value}
        disabled={disabled}
        size={size} // Usar el tamaño especificado
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            error={error}
            required={required}
            placeholder={placeholder}
            helperText={helperText}
            size={size}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: size === 'small' ? '40px' : '56px', // Misma altura que TextField
                paddingTop: '0px',
                paddingBottom: '0px',
              },
              '& .MuiInputLabel-root': {
                transform: 'translate(14px, 9px) scale(1)', // Misma posición que TextField
              },
              '& .MuiInputLabel-shrink': {
                transform: 'translate(14px, -9px) scale(0.75)',
              },
            }}
          />
        )}
        sx={{
          '& .MuiAutocomplete-inputRoot': {
            paddingTop: '0px',
            paddingBottom: '0px',
          },
        }}
      />
      {helperText && !error && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default CustomAutocomplete;