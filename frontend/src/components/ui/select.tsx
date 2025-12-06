// src/components/ui/MultiSelect.tsx
import React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

interface MultiSelectProps {
  label: string;
  options: Array<{ value: string; label: string }>;
  selectedValues: string[];
  onChange: (values: string[]) => void;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
  required?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  error = false,
  helperText,
  placeholder = "Seleccione...",
  required = false
}) => {
  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent<typeof selectedValues>) => {
    const {
      target: { value },
    } = event;
    onChange(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const getStyles = (value: string) => {
    return {
      fontWeight: selectedValues.includes(value)
        ? theme.typography.fontWeightMedium
        : theme.typography.fontWeightRegular,
    };
  };

  return (
    <FormControl sx={{ width: '100%' }} error={error}>
      <InputLabel id={`${label}-label`} required={required}>
        {label}
      </InputLabel>
      <Select
        labelId={`${label}-label`}
        multiple
        value={selectedValues}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => {
              const option = options.find(opt => opt.value === value);
              return (
                <Chip 
                  key={value} 
                  label={option?.label || value} 
                  size="small"
                />
              );
            })}
            {selected.length === 0 && (
              <span style={{ color: '#999', fontStyle: 'italic' }}>
                {placeholder}
              </span>
            )}
          </Box>
        )}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
              width: 250,
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            style={getStyles(option.value)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && (
        <span className="helper-text" style={{ color: error ? '#f44336' : '#666', fontSize: '0.875rem' }}>
          {helperText}
        </span>
      )}
    </FormControl>
  );
};

export default MultiSelect;