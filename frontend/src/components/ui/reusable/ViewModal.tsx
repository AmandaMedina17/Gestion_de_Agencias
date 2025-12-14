// components/ui/reusable/ViewModal.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";

interface ViewField<T> {
  label: string;
  value: string | number | React.ReactNode;
  render?: (value: any, item: T) => React.ReactNode;
}

interface ViewModalProps<T> {
  title: string;
  item: T;
  onClose: () => void;
  fields: ViewField<T>[];
}

const ViewModal = <T,>({
  title,
  item,
  onClose,
  fields,
}: ViewModalProps<T>) => {
  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, boxShadow: 24 }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        bgcolor: 'primary.main',
        color: 'white',
        py: 2
      }}>
        <Typography variant="h6" fontWeight="bold">{title}</Typography>
        <IconButton 
          onClick={onClose} 
          sx={{ color: 'white' }}
          size="small"
        >
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ mt: 2, p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {fields.map((field, index) => (
            <Box key={index}>
              <Typography 
                variant="subtitle2" 
                color="text.secondary" 
                gutterBottom
                sx={{ fontWeight: 600, fontSize: '0.9rem' }}
              >
                {field.label}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  wordBreak: 'break-word',
                  fontSize: '1rem',
                  color: 'text.primary'
                }}
              >
                {field.render ? field.render(field.value, item) : field.value}
              </Typography>
              {index < fields.length - 1 && <Divider sx={{ mt: 2 }} />}
            </Box>
          ))}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, px: 3 }}>
        <Button 
          onClick={onClose} 
          variant="contained" 
          color="primary" 
          sx={{ minWidth: 100 }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewModal;