// App.tsx
import React, { Activity } from 'react';
import{ BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
 import { ResponsibleProvider } from './context/ResponsibleContext';
import { ApprenticeProvider } from './context/ApprenticeContext';
// import Login from './components/Login/Login';
import ManagerDashboard from './components/Manager/ManagerDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
//import './App.css';
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
import LoginPage from './components/prueba/LoginPage'
import './components/prueba/LoginPage'

// const PrivateRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
//   const { user, isAuthenticated } = useAuth();
  
//   if (!isAuthenticated || !user) {
//     return <Navigate to="/login" />;
//   }
  
//   if (!allowedRoles.includes(user.role)) {
//     return <Navigate to="/" />;
//   }
  
//   return <>{children}</>;
// };

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
                                  <Route path="/" element={<LoginPage />} />
                                  <Route 
                                    path="/admin" 
                                    element={
                                      <ResponsibleProvider> {/* Solo en admin */}
                                        <AdminDashboard />
                                      </ResponsibleProvider>
                                    } 
                                  />
                                  <Route 
                                    path="/manager" 
                                    element={
                                      <ManagerDashboard />
                                    } 
                                  />
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
   
  );
}

export default App;