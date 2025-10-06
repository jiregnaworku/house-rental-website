import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './components/Home/Home';
import { AuthForm } from './components/auth/AuthForm';
import { TenantDashboard } from './components/tenant/TenantDashboard';
import  LandlordDashboard  from './components/dashboard/LandlordDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import PropertyForm from './components/properties/PropertyForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthForm />} />
            <Route 
              path="/tenant/dashboard" 
              element={
                <ProtectedRoute>
                  <TenantDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/landlord/dashboard" 
              element={
                <ProtectedRoute>
                  <LandlordDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/properties/new" 
              element={
                <ProtectedRoute>
                  <PropertyForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/properties/:id/edit" 
              element={
                <ProtectedRoute>
                  <PropertyForm />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} newestOnTop closeOnClick />
        </div>
      </AuthProvider>
    </Router>
  );
}

// ✅ Protected route stays the same
const ProtectedRoute = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default App;
