
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import RegisterDialog from '@/components/auth/RegisterDialog';
import WelcomeDialog from '@/components/WelcomeDialog';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const RegisterPage = () => {
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [registeredUserInfo, setRegisteredUserInfo] = useState<{ fullName: string; email?: string }>({ fullName: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Verificar si el usuario ya está autenticado
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        // Obtener el rol del usuario y verificar el estado del onboarding
        const { data: userData } = await supabase.auth.getUser();
        const userRole = userData.user?.user_metadata?.role || 'user';
        const isOnboardingCompleted = userData.user?.user_metadata?.onboarding_completed === true;
        
        if (userRole === 'artist') {
          const isArtistOnboardingCompleted = userData.user?.user_metadata?.artist_onboarding_completed === true;
          if (!isArtistOnboardingCompleted) {
            navigate('/register/artist');
          } else {
            navigate('/dashboard');
          }
        } else {
          if (!isOnboardingCompleted) {
            navigate('/user-onboarding');
          } else {
            navigate('/user-dashboard');
          }
        }
      }
    };
    
    checkSession();

    // Configurar listener para cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session);
        if (session) {
          // Verificar el estado del onboarding
          const { data: userData } = await supabase.auth.getUser();
          const userRole = userData.user?.user_metadata?.role || 'user';
          const isOnboardingCompleted = userData.user?.user_metadata?.onboarding_completed === true;
          
          if (userRole === 'artist') {
            const isArtistOnboardingCompleted = userData.user?.user_metadata?.artist_onboarding_completed === true;
            if (!isArtistOnboardingCompleted) {
              navigate('/register/artist');
            } else {
              navigate('/dashboard');
            }
          } else {
            if (!isOnboardingCompleted) {
              navigate('/user-onboarding');
            } else {
              navigate('/user-dashboard');
            }
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleRegistrationSuccess = (userInfo: { fullName: string; email?: string }) => {
    setRegisteredUserInfo(userInfo);
    // Establecer bandera para indicar que venimos del registro
    localStorage.setItem('is_from_registration', 'true');
    // Redirigimos al onboarding
    navigate('/user-onboarding');
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    setIsLoading(true);

    try {
      // También establecer bandera para registro con redes sociales
      localStorage.setItem('is_from_registration', 'true');
      
      let { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: window.location.origin + '/user-onboarding'
        }
      });

      if (error) throw error;

    } catch (error: any) {
      console.error(`Error con inicio de sesión ${provider}:`, error);
      toast.error(`Error con ${provider}`, {
        description: error.message || `No se pudo iniciar sesión con ${provider}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-vyba-dark-bg flex flex-col">
      <Navbar />

      <div className="container mx-auto flex flex-col items-center px-6 pt-24 md:pt-12 pb-20 flex-1 h-full justify-center">
        <div className="w-full space-y-6 md:mt-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Te damos la bienvenida a VYBA</h1>
          </div>

          <div className="space-y-4 mt-16 max-w-sm mx-auto">
            <Button 
              variant="secondary" 
              className="w-full flex items-center justify-center gap-2 bg-[#F7F7F7] text-black"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
            >
              <img src="/logos/google-logo.svg" alt="Google" width={20} height={20} />
              Continuar con Google
            </Button>

            <Button 
              variant="secondary" 
              className="w-full flex items-center justify-center gap-2 bg-[#F7F7F7] text-black"
              onClick={() => handleSocialLogin('facebook')}
              disabled={isLoading}
            >
              <img src="/logos/facebook-logo.svg" alt="Facebook" width={20} height={20} />
              Continuar con Facebook
            </Button>

            <Button 
              variant="secondary" 
              className="w-full flex items-center justify-center gap-2 bg-[#F7F7F7] text-black"
              onClick={() => handleSocialLogin('apple')}
              disabled={isLoading}
            >
              <img src="/logos/apple-logo.svg" alt="Apple" width={20} height={20} />
              Continuar con Apple
            </Button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-600">o</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <Button
              variant="secondary"
              className="w-full flex items-center justify-center gap-2 bg-[#F7F7F7] text-black"
              onClick={() => setShowRegisterDialog(true)}
              disabled={isLoading}
            >
              <Mail size={20} />
              Continuar con Mail
            </Button>
          </div>

          <div className="text-center text-sm mt-6">
            <p className="text-center text-sm font-light">
              Ya tienes cuenta. <Link to="/auth" className="font-medium text-black">Iniciar Sesión</Link>
            </p>
          </div>
        </div>
      </div>

      <RegisterDialog
        open={showRegisterDialog}
        onOpenChange={setShowRegisterDialog}
        onSuccess={handleRegistrationSuccess}
      />

      <WelcomeDialog 
        open={showWelcomeDialog}
        onOpenChange={setShowWelcomeDialog}
        userInfo={registeredUserInfo}
      />
    </main>
  );
};

export default RegisterPage;
