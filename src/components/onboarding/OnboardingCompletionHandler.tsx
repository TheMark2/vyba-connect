
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import WelcomeDialog from '@/components/WelcomeDialog';

// Este componente se puede importar en el UserOnboardingPage para manejar
// la redirección después de completar el onboarding y mostrar el WelcomeDialog
const OnboardingCompletionHandler = () => {
  const navigate = useNavigate();
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [userInfo, setUserInfo] = useState<{ fullName: string; email?: string }>({ fullName: '' });

  // Este efecto se ejecutará cuando los metadatos de usuario cambien para indicar
  // que el onboarding se ha completado
  useEffect(() => {
    const handleOnboardingCompletion = async () => {
      const { data } = await supabase.auth.getUser();
      
      // Si el usuario existe y ha completado el onboarding
      if (data?.user?.user_metadata?.onboarding_completed) {
        // Obtener información del usuario para el WelcomeDialog
        const name = data.user.user_metadata?.name || '';
        const lastName = data.user.user_metadata?.lastName || '';
        
        setUserInfo({
          fullName: `${name} ${lastName}`.trim(),
          email: data.user.email
        });
        
        // Mostrar el WelcomeDialog
        setShowWelcomeDialog(true);
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

  // Manejar el cierre del WelcomeDialog
  const handleWelcomeDialogClose = () => {
    setShowWelcomeDialog(false);
    navigate('/user-dashboard');
  };

  return (
    <>
      {showWelcomeDialog && (
        <WelcomeDialog 
          open={showWelcomeDialog} 
          onOpenChange={handleWelcomeDialogClose} 
          userInfo={userInfo} 
        />
      )}
    </>
  );
};

export default OnboardingCompletionHandler;
