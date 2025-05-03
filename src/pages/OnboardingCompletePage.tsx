
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingCompletionHandler from '@/components/onboarding/OnboardingCompletionHandler';
import { useAuth } from '@/contexts/AuthContext';

// Esta página sirve como puente entre el onboarding y el dashboard
// Muestra el diálogo de bienvenida solo si viene del registro, y luego redirecciona al dashboard
const OnboardingCompletePage = () => {
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated, isOnboardingCompleted } = useAuth();

  useEffect(() => {
    // Si el usuario no está autenticado después de cargar, redirigir a login
    if (!isLoading && !isAuthenticated) {
      navigate('/auth', { replace: true });
      return;
    }

    // Si venimos del login y no del registro, redirigir directamente al dashboard
    const isFromRegistration = localStorage.getItem('is_from_registration') === 'true';
    
    // Si está autenticado pero no viene del registro, redirigir directamente al dashboard
    if (!isLoading && isAuthenticated && !isFromRegistration) {
      navigate('/user-dashboard', { replace: true });
    }
  }, [isLoading, isAuthenticated, isOnboardingCompleted, navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      {/* El componente OnboardingCompletionHandler detectará si venimos del registro 
          y mostrará automáticamente el WelcomeDialog solo en ese caso */}
      <OnboardingCompletionHandler />
    </div>
  );
};

export default OnboardingCompletePage;
