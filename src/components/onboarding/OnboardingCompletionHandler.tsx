
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

// Este componente se puede importar en el UserOnboardingPage para manejar
// la redirección después de completar el onboarding
const OnboardingCompletionHandler = () => {
  const navigate = useNavigate();

  // Este efecto se ejecutará cuando los metadatos de usuario cambien para indicar
  // que el onboarding se ha completado
  useEffect(() => {
    const handleOnboardingCompletion = async () => {
      const { data } = await supabase.auth.getUser();
      
      // Si el usuario existe y ha completado el onboarding
      if (data?.user?.user_metadata?.onboarding_completed) {
        // Redirigir a la ruta que muestra el WelcomeDialog
        navigate('/onboarding-complete');
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
  }, [navigate]);

  // Este componente no renderiza nada visible
  return null;
};

export default OnboardingCompletionHandler;
