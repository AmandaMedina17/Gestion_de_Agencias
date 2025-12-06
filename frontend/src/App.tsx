// App.tsx
import React, { Activity } from 'react';
<<<<<<< Updated upstream
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ResponsibleProvider } from './context/ResponsibleContext';
import { ApprenticeProvider } from './context/ApprenticeContext';
import Login from './components/Login/Login';
import ManagerDashboard from './components/Manager/ManagerDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import './App.css';
=======
import{ BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
 import { ResponsibleProvider } from './context/ResponsibleContext';
import { ApprenticeProvider } from './context/ApprenticeContext';
// import Login from './components/Login/Login';
import ManagerDashboard from './components/Manager/ManagerDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
//import './App.css';
>>>>>>> Stashed changes
import { PlaceProvider } from './context/PlaceContext';
import { ArtistProvider } from './context/ArtistContext';
import { ActivityProvider } from './context/ActivityContext';
import { ApprenticeEvaluationProvider } from './context/EvaluationContext';
import { AgencyProvider } from './context/AgencyContext';
import { ContractProvider } from './context/ContractContext';
import { IncomeProvider } from './context/IncomeContext';
import { BillboardListProvider } from './context/BillboardListContext';
import { useAuth } from './context/AuthContext';
import { AlbumProvider } from './context/AlbumContext';
import { SongProvider } from './context/SongContext';
<<<<<<< Updated upstream
=======
import LoginPage from './components/prueba/LoginPage'
import './components/prueba/LoginPage'
>>>>>>> Stashed changes

const PrivateRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <SongProvider>
      <AlbumProvider>
        <BillboardListProvider>
          <IncomeProvider>
            <ContractProvider>
              <AgencyProvider>
                <ActivityProvider>
                  <ApprenticeEvaluationProvider>
                    <ArtistProvider>
                      <ApprenticeProvider>
                        <PlaceProvider>
                          <AuthProvider>
                            <Router>
                              <div className="App">
                                <Routes>
<<<<<<< Updated upstream
                                  <Route path="/login" element={<Login />} />
                                  <Route 
                                    path="/manager" 
                                    element={
                                      <PrivateRoute allowedRoles={['AGENCY_MANAGER', 'MANAGER']}>
                                        <ManagerDashboard />
                                      </PrivateRoute>
                                    } 
                                  />
                                  <Route 
                                    path="/admin" 
                                    element={
                                      <ResponsibleProvider> {/* Solo en admin */}
                                        <AdminDashboard />
                                      </ResponsibleProvider>
                                    } 
                                  />
                                  <Route path="/" element={<Navigate to="/login" />} />
=======
                                  <Route path="/" element={<LoginPage />} />
                                  <Route 
                                                        path="/admin" 
                                                        element={
                                                          <ResponsibleProvider> {/* Solo en admin */}
                                                            <AdminDashboard />
                                                          </ResponsibleProvider>
                                                        } 
                                                      />
>>>>>>> Stashed changes
                                </Routes>
                              </div>
                            </Router>
                          </AuthProvider>
                        </PlaceProvider>
                      </ApprenticeProvider>
                    </ArtistProvider>
                  </ApprenticeEvaluationProvider>
                </ActivityProvider>
              </AgencyProvider>
            </ContractProvider>
          </IncomeProvider>
        </BillboardListProvider>
      </AlbumProvider>
    </SongProvider>
<<<<<<< Updated upstream
=======
   
>>>>>>> Stashed changes
  );
}

export default App;