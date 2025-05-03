import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingCompletionHandler from '@/components/onboarding/OnboardingCompletionHandler';
import { useAuth } from '@/contexts/AuthContext';

// Esta página sirve como puente entre el onboarding y el dashboard
// Muestra el diálogo de bienvenida y luego redirecciona al dashboard
const OnboardingCompletePage = () => {
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated, isOnboardingCompleted } = useAuth();

  useEffect(() => {
    // Si el usuario no está autenticado después de cargar, redirigir a login
    if (!isLoading && !isAuthenticated) {
      navigate('/auth', { replace: true });
      return;
    }

    // Si está autenticado pero no hay confirmación de onboarding completado
    if (!isLoading && isAuthenticated && !isOnboardingCompleted) {
      // Opcional: podríamos redirigir de nuevo al onboarding si no está completo
      // Sin embargo, si llegamos aquí desde UserOnboardingPage, asumimos que está completo
      // navigate('/user-onboarding', { replace: true });
    }
  }, [isLoading, isAuthenticated, isOnboardingCompleted, navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      {/* El componente OnboardingCompletionHandler detectará que estamos en esta ruta
          y mostrará automáticamente el WelcomeDialog */}
      <OnboardingCompletionHandler />
    </div>
  );
};

export default OnboardingCompletePage; 