// src/views/SuccessManagement/SuccessManagement.tsx
import React, { useState, useEffect } from "react";
import { Tab, Tabs, Box, Typography, AppBar } from "@mui/material";
import AwardTab from "./AwardTab";
import BillboardTab from "./BillboardTab";
import './SuccessManagement.css';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`success-tabpanel-${index}`}
      aria-labelledby={`success-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const SuccessManagement: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info" | "warning";
    title?: string;
    message: string;
  } | null>(null);

  // Cargar datos automáticamente al cambiar de pestaña
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Limpiar notificación automáticamente después de 5 segundos
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <section id="success_management" className="content-section active">
      <div className="success-header" >
        <Typography variant="h4" component="h1" className="success-title" >
          Gestión de Éxitos
        </Typography>
        <Typography variant="subtitle1" className="success-subtitle">
          Administre los premios de álbumes y las posiciones en Billboard
        </Typography>
      </div>

      {notification && (
        <div className={`notification notification-${notification.type}`}>
          {notification.title && <strong>{notification.title}: </strong>}
          {notification.message}
          <button 
            className="notification-close" 
            onClick={() => setNotification(null)}
            aria-label="Cerrar notificación"
          >
            ×
          </button>
        </div>
      )}

      <Box sx={{ width: '100%', bgcolor: 'background.paper', mt: 2 }}>
        <AppBar position="static" color="default" sx={{ borderRadius: '8px 8px 0 0' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            aria-label="success management tabs"
            className="success-tabs"
          >
            <Tab 
              label={
                <div className="tab-content">
                  <span className="tab-icon">🏆</span>
                  <span>Premios de Álbumes</span>
                </div>
              }
              id="success-tab-0"
              aria-controls="success-tabpanel-0"
              className="tab-label"
            />
            <Tab 
              label={
                <div className="tab-content">
                  <span className="tab-icon">📊</span>
                  <span>Canciones en Billboard</span>
                </div>
              }
              id="success-tab-1"
              aria-controls="success-tabpanel-1"
              className="tab-label"
            />
          </Tabs>
        </AppBar>
        
        <TabPanel value={tabValue} index={0}>
          <AwardTab 
            onNotification={(type, title, message) => 
              setNotification({ type, title, message })
            }
          />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <BillboardTab 
            onNotification={(type, title, message) => 
              setNotification({ type, title, message })
            }
          />
        </TabPanel>
      </Box>

      
    </section>
  );
};

export default SuccessManagement;