import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Mail, Info } from "lucide-react";
import Navbar from "@/components/Navbar";
import RegisterDialog from '@/components/auth/RegisterDialog';
import LoginDialog from '@/components/auth/LoginDialog';
import WelcomeDialog from '@/components/WelcomeDialog';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";

const AuthPage = () => {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [registeredUserInfo, setRegisteredUserInfo] = useState<{ fullName: string; email?: string }>({ fullName: '' });
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { isLoading: authLoading, isAuthenticated, getRedirectUrl } = useAuth();

  const handleShowEmailForm = () => {
    setShowLoginDialog(true);
  };

  const handleRegistrationSuccess = (userInfo: { fullName: string; email?: string }) => {
    console.log("Registration success, showing welcome dialog with user info:", userInfo);
    setRegisteredUserInfo(userInfo);
    setShowRegisterDialog(false);
    
    // Pequeño retraso para que se cierre primero el de registro
    setTimeout(() => {
      setShowWelcomeDialog(true);
    }, 300);
  };

  const handleLoginSuccess = async (userData: any) => {
    console.log("Login success callback ejecutado");
    
    // Usando la función del contexto de autenticación para redireccionar
    navigate(getRedirectUrl());
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          // No establecemos redirectTo para manejar la redirección según el rol en el listener onAuthStateChange
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

  const handleRedirectToDashboard = () => {
    navigate(getRedirectUrl());
  };

  // Pantalla de carga si todavía se está verificando la sesión
  if (authLoading) {
    return (
      <main className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-gray-200 h-16 w-16 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>
          <p className="text-gray-600">Verificando sesión...</p>
        </div>
      </main>
    );
  }

  // Mostrar la página de autenticación, con alerta si el usuario ya está autenticado
  return (
    <main className="min-h-screen bg-white dark:bg-vyba-dark-bg flex flex-col">
      <Navbar />
      
      <div className="container mx-auto flex flex-col items-center px-6 pt-24 md:pt-12 pb-20 flex-1 h-full justify-center">
        <div className="w-full space-y-6 md:mt-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Te damos la bienvenida a VYBA</h1>
          </div>

          {isAuthenticated && (
            <Alert className="mb-6 bg-blue-50 border-blue-100">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">Ya has iniciado sesión</AlertTitle>
              <AlertDescription className="text-blue-700">
                Ya tienes una sesión activa. Puedes ir a tu <Button variant="link" className="p-0 text-blue-700 font-medium underline" onClick={handleRedirectToDashboard}>panel de control</Button> o continuar si deseas crear una cuenta nueva.
              </AlertDescription>
            </Alert>
          )}

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
              onClick={handleShowEmailForm}
              disabled={isLoading}
            >
              <Mail size={20} />
              Iniciar sesión con Mail
            </Button>
          </div>

          <div className="text-center text-sm mt-6">
            <p className="text-center text-sm font-light">
              ¿No tienes cuenta? <Link to="/register" className="font-medium text-black">Regístrate</Link>
            </p>
          </div>
        </div>
      </div>

      <LoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onSuccess={handleLoginSuccess}
      />

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

export default AuthPage;
