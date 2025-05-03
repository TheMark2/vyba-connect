
import React, { useState, useEffect } from 'react';
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

  // Improved version that correctly identifies if an email exists without using getUserByEmail
  const checkEmailExists = async (email: string) => {
    try {
      console.log("Checking if email exists (RegisterPage):", email);
      
      // Intentar obtener el usuario por correo electrónico para verificar si existe
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .maybeSingle();
      
      if (data) {
        // Si encontramos el correo en la tabla de perfiles, entonces existe
        return { exists: true, provider: 'email' };
      }
      
      // También verificamos en la tabla auth.users, pero indirectamente a través de la API de autenticación
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false, // No crear un usuario nuevo si no existe
        }
      });
      
      // Si el error indica que el usuario no existe, entonces no está registrado
      if (signInError && signInError.message.includes("Email not found")) {
        return { exists: false };
      }
      
      // Si llegamos aquí sin un error claro sobre la no existencia, realizamos una comprobación adicional      
      // Intentamos obtener información de la sesión actual para comparar
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUserEmail = sessionData?.session?.user?.email;
      
      // Si el email actual coincide con el email de la sesión, entonces existe
      if (currentUserEmail && currentUserEmail.toLowerCase() === email.toLowerCase()) {
        console.log("Email matches current session user");
        return { exists: true, provider: 'email' };
      }
      
      // Si llegamos aquí sin un error claro sobre la no existencia, asumimos que el usuario podría existir
      return { exists: false };
      
    } catch (error) {
      console.error("Error checking email:", error);
      return { exists: false }; // Por defecto permitir el intento de registro
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
