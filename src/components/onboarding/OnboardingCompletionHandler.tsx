import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import WelcomeDialog from '@/components/WelcomeDialog';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Este componente gestiona la redirección después del onboarding y muestra el diálogo de bienvenida
// Solo se muestra después del registro, no después del login
const OnboardingCompletionHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, reloadUserData, userName } = useAuth();
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [userInfo, setUserInfo] = useState<{ fullName: string; email?: string; }>({ 
    fullName: 'Usuario',
    email: user?.email 
  });

  // Actualizar el userInfo cuando cambie el userName del contexto
  useEffect(() => {
    if (user) {
      setUserInfo({
        fullName: userName || user.email?.split('@')[0] || 'Usuario',
        email: user.email
      });
    }
  }, [user, userName]);

  // Este efecto comprueba la bandera is_from_registration cada segundo
  // para asegurarnos de que la captamos incluso si se establece después de que este componente se monte
  useEffect(() => {
    // Verificar si la ruta actual comienza con /user-dashboard
    const isUserDashboardRoute = location.pathname.startsWith('/user-dashboard');
    
    if (!isUserDashboardRoute) {
      return; // No hacer nada si no estamos en una ruta de dashboard
    }
    
    console.log('OnboardingCompletionHandler montado en ruta:', location.pathname);
    console.log('Valor actual de is_from_registration:', localStorage.getItem('is_from_registration'));
    console.log('Valor actual de onboarding_skipped:', localStorage.getItem('onboarding_skipped'));
    
    // Comprobar la bandera cada segundo durante 10 segundos
    const checkInterval = setInterval(() => {
      const isFromRegistration = localStorage.getItem('is_from_registration') === 'true';
      console.log('Comprobando bandera is_from_registration:', isFromRegistration);
      
      if (isFromRegistration) {
        console.log('Bandera encontrada, mostrando diálogo...');
        clearInterval(checkInterval);
        
        // Recargar datos del usuario para tener la información más reciente
        reloadUserData();
        
        // Mostrar el diálogo inmediatamente
        setShowWelcomeDialog(true);
        toast.info('¡Bienvenido a VYBA!');
        
        // Limpiar banderas después de usarlas
        localStorage.removeItem('is_from_registration');
        localStorage.removeItem('onboarding_skipped'); // También eliminar esta bandera
        localStorage.setItem('welcome_dialog_shown', new Date().toISOString());
        
        console.log('Banderas is_from_registration y onboarding_skipped eliminadas');
      }
    }, 1000);
    
    // Limpiar el intervalo después de 10 segundos o cuando se desmonte el componente
    const clearTimer = setTimeout(() => {
      clearInterval(checkInterval);
    }, 10000);
    
    return () => {
      clearInterval(checkInterval);
      clearTimeout(clearTimer);
    };
  }, [location.pathname, reloadUserData]);
  
  // Redirigir si estamos en la página de onboarding complete
  useEffect(() => {
    if (location.pathname === '/onboarding-complete') {
      // Si estamos en la página de onboarding complete, redirigir inmediatamente
      navigate('/user-dashboard', { replace: true });
    }
  }, [location.pathname, navigate]);

  // Manejar el cierre del WelcomeDialog
  const handleWelcomeDialogClose = () => {
    setShowWelcomeDialog(false);
  };

  // Forzar mostrar el diálogo independientemente de la bandera (para depuración)
  useEffect(() => {
    // Si hay un parámetro en la URL showWelcome=true, mostrar el diálogo
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('showWelcome') === 'true') {
      console.log('Mostrando WelcomeDialog por parámetro URL');
      setShowWelcomeDialog(true);
    }
  }, [location.search]);

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
