import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WalletProvider, useWallet } from '@/contexts/WalletContext';
import { Toaster } from '@/components/ui/toaster';
import LoginPage from '@/components/LoginPage';
import Dashboard from '@/components/Dashboard';

const AppContent = () => {
  const { isConnected } = useWallet();

  return (
    <div className="min-h-screen bg-black">
      <Routes>
        <Route 
          path="/login" 
          element={!isConnected ? <LoginPage /> : <Navigate to="/dashboard" replace />} 
        />
        <Route 
          path="/dashboard" 
          element={isConnected ? <Dashboard /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/" 
          element={<Navigate to={isConnected ? "/dashboard" : "/login"} replace />} 
        />
      </Routes>
      <Toaster />
    </div>
  );
};

function App() {
  return (
    <WalletProvider>
      <Router>
        <AppContent />
      </Router>
    </WalletProvider>
  );
}

export default App;