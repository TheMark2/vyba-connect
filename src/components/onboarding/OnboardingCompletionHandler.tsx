
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import WelcomeDialog from '@/components/WelcomeDialog';
import { toast } from 'sonner';

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
      try {
        const { data } = await supabase.auth.getUser();
        
        // Si el usuario existe y ha completado el onboarding
        if (data?.user) {
          // Actualizar el estado de onboarding_completed a true
          await supabase.auth.updateUser({
            data: {
              onboarding_completed: true
            }
          });
          
          // Obtener información del usuario para el WelcomeDialog
          const name = data.user.user_metadata?.name || '';
          const lastName = data.user.user_metadata?.lastName || '';
          
          setUserInfo({
            fullName: `${name} ${lastName}`.trim(),
            email: data.user.email
          });
          
          // Mostrar el WelcomeDialog
          setShowWelcomeDialog(true);
        } else {
          // Si no hay usuario autenticado, redirigir a la página de inicio de sesión
          toast.error("Debes iniciar sesión para completar el onboarding");
          navigate('/auth');
        }
      } catch (error) {
        console.error("Error al verificar el estado de onboarding:", error);
        toast.error("Error al procesar tus datos");
        navigate('/auth');
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
