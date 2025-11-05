import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import ManagerDashboard from './components/Manager/ManagerDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/manager" element={<ManagerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;