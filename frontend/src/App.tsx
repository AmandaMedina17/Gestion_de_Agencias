// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ResponsibleProvider } from './context/ResponsibleContext';
import { ApprenticeProvider } from './context/ApprenticeContext';
import Login from './components/Login/Login';
import ManagerDashboard from './components/Manager/ManagerDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import './App.css';
import { PlaceProvider } from './context/PlaceContext';
import { ArtistProvider } from './context/ArtistContext';

function App() {
  return (
    <ArtistProvider>
      <ApprenticeProvider>
        <PlaceProvider>
          <AuthProvider>
            <Router>
              <div className="App">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/manager" element={<ManagerDashboard />} />
                  <Route 
                    path="/admin" 
                    element={
                      <ResponsibleProvider> {/* Solo en admin */}
                        <AdminDashboard />
                      </ResponsibleProvider>
                    } 
                  />
                  <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
              </div>
            </Router>
          </AuthProvider>
        </PlaceProvider>
      </ApprenticeProvider>
    </ArtistProvider>
  );
}

export default App;