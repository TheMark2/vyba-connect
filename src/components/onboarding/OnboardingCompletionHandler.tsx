
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

// Este componente se puede importar en el UserOnboardingPage para manejar
// la redirección después de completar el onboarding
const OnboardingCompletionHandler = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, refreshUser } = useAuth();

  // Este efecto se ejecutará cuando los metadatos de usuario cambien para indicar
  // que el onboarding se ha completado
  useEffect(() => {
    const handleOnboardingCompletion = async () => {
      if (!isAuthenticated || !user) {
        return;
      }
      
      try {
        const { data } = await supabase.auth.getUser();
        
        // Si el usuario existe y ha completado el onboarding
        if (data?.user?.user_metadata?.onboarding_completed) {
          // Actualizar el contexto de autenticación para reflejar los cambios
          await refreshUser();
          // Redirigir a la ruta que muestra el WelcomeDialog
          navigate('/onboarding-complete');
        }
      } catch (error) {
        console.error('Error al verificar estado de onboarding:', error);
        toast.error('Error al verificar tu perfil');
      }
    };

    // Verificar si ya se ha completado el onboarding
    handleOnboardingCompletion();

    // También podemos escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'USER_UPDATED') {
        handleOnboardingCompletion();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, isAuthenticated, user, refreshUser]);

  // Este componente no renderiza nada visible
  return null;
};

export default OnboardingCompletionHandler;
