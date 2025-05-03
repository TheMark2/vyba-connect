
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import WelcomeDialog from '@/components/WelcomeDialog';
import { useAuth } from '@/contexts/AuthContext';

// Este componente gestiona la redirección después del onboarding y muestra el diálogo de bienvenida
// Solo se muestra después del registro, no después del login
const OnboardingCompletionHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Información del usuario para el diálogo de bienvenida
  const [userInfo] = useState<{ fullName: string; email?: string; }>({ 
    fullName: user?.user_metadata?.name || 'Usuario',
    email: user?.email 
  });

  // Este efecto solo muestra el diálogo en la página de onboarding completo
  // y solo si venimos del registro (verificamos con localStorage)
  useEffect(() => {
    if (location.pathname === '/onboarding-complete') {
      const isFromRegistration = localStorage.getItem('is_from_registration') === 'true';
      
      // Solo mostrar el diálogo si venimos del registro
      if (isFromRegistration) {
        // Pequeña pausa para permitir que la UI se actualice
        setTimeout(() => {
          setShowWelcomeDialog(true);
          setIsLoading(false);
          
          // Limpiar bandera después de usarla
          localStorage.removeItem('is_from_registration');
        }, 500);
      } else {
        // Si no venimos del registro, redirigir al dashboard directamente
        navigate('/user-dashboard', { replace: true });
      }
    } else {
      setIsLoading(false);
    }
  }, [location.pathname, navigate]);

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
