import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import PropertiesList from '../components/properties/PropertiesList';
import PropertyForm from '../components/properties/PropertyForm';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PropertiesPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/properties' } });
      toast.info('Please log in to access properties');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-8">
        <Routes>
          <Route path="/" element={<PropertiesList />} />
          <Route path="/new" element={<PropertyForm />} />
          <Route path="/edit/:id" element={<PropertyForm />} />
        </Routes>
      </main>
    </div>
  );
};

export default PropertiesPage;
