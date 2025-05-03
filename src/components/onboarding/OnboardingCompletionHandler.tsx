
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import WelcomeDialog from '@/components/WelcomeDialog';

// Este componente gestiona la redirección después del onboarding y muestra el diálogo de bienvenida
// Simplificado para eliminar verificaciones de autenticación
const OnboardingCompletionHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Información básica para el diálogo de bienvenida
  const [userInfo] = useState<{ fullName: string; email?: string; }>({ 
    fullName: 'Usuario' 
  });

  // Este efecto solo muestra el diálogo en la página de onboarding completo
  useEffect(() => {
    if (location.pathname === '/onboarding-complete') {
      // Pequeña pausa para permitir que la UI se actualice
      setTimeout(() => {
        setShowWelcomeDialog(true);
        setIsLoading(false);
      }, 500);
    } else {
      setIsLoading(false);
    }
  }, [location.pathname]);

  // Manejar el cierre del WelcomeDialog
  const handleWelcomeDialogClose = () => {
    setShowWelcomeDialog(false);
    navigate('/user-dashboard', { replace: true });
  };

  return (
    <>
      {isLoading && (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-blue-100"></div>
            <div className="mt-6 text-lg text-gray-500">Preparando tu experiencia...</div>
          </div>
        </div>
      )}
      
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
