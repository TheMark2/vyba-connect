import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Mail, AlertCircle, Info } from "lucide-react";
import Navbar from "@/components/Navbar";
import RegisterDialog from '@/components/auth/RegisterDialog';
import WelcomeDialog from '@/components/WelcomeDialog';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useAuth } from '@/contexts/AuthContext';

const RegisterPage = () => {
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [registeredUserInfo, setRegisteredUserInfo] = useState<{ fullName: string; email?: string }>({ fullName: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<{message: string, provider?: string} | null>(null);
  const navigate = useNavigate();
  
  // Usar el contexto de autenticación
  const { isAuthenticated, getRedirectUrl } = useAuth();

  const handleRegistrationSuccess = (userInfo: { fullName: string; email?: string }) => {
    setRegisteredUserInfo(userInfo);
    // Redirigimos directamente al onboarding sin preguntar
    navigate('/user-onboarding');
  };

  const checkEmailExists = async (email: string) => {
    try {
      // Intentamos iniciar sesión con un correo y una contraseña falsa
      // para comprobar si el correo existe
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: 'check_if_email_exists_only'
      });
      
      // Si hay un error específico sobre credenciales inválidas, el email existe
      if (error && error.message.includes("Invalid login credentials")) {
        // Verificamos con qué proveedor está asociado este email
        const signInOAuthProviders = ['google', 'facebook', 'apple'];
        let detectedProvider = 'email';
        
        // Este es un método impreciso y sirve solo como aproximación
        // Una implementación completa requeriría un endpoint en el servidor
        
        return { exists: true, provider: detectedProvider };
      }
      
      // Si no hay error o es otro tipo de error, asumimos que el email no existe
      return { exists: false };
    } catch (error) {
      console.error("Error al verificar email:", error);
      return { exists: false };
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    setIsLoading(true);
    setEmailError(null);

    try {
      let { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: window.location.origin + '/dashboard'
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

          {isAuthenticated && (
            <Alert className="mb-6 bg-blue-50 border-blue-100">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">Ya has iniciado sesión</AlertTitle>
              <AlertDescription className="text-blue-700">
                Ya tienes una sesión activa. Puedes ir a tu <Button variant="link" className="p-0 text-blue-700 font-medium underline" onClick={() => navigate(getRedirectUrl())}>panel de control</Button> o continuar con el registro si deseas crear una cuenta nueva.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4 mt-16 max-w-sm mx-auto">
            {emailError && (
              <Alert variant="destructive" className="mb-4 bg-red-50 text-red-800 border-none">
                <AlertTitle className="text-red-800 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" /> Email ya registrado
                </AlertTitle>
                <AlertDescription className="text-red-700">
                  {emailError.message}
                </AlertDescription>
              </Alert>
            )}
            
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
