import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Esta página sirve como puente entre el onboarding y el dashboard
// No muestra nada visualmente, solo redirige inmediatamente
const OnboardingCompletePage = () => {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      // Si no está autenticado, redirigir a login
      navigate('/auth', { replace: true });
      return;
    }

    // Redirigir inmediatamente al dashboard
    navigate('/user-dashboard', { replace: true });
  }, [isLoading, isAuthenticated, navigate]);

  // Mostrar un spinner muy simple mientras se redirige
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
    </div>
  );
};

export default OnboardingCompletePage;
