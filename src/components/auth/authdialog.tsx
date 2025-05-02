
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, AlertCircle, Info } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import RegisterDialog from './RegisterDialog';
import LoginDialog from './LoginDialog';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthDialog = ({ open, onOpenChange }: AuthDialogProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [emailError, setEmailError] = useState<{message: string, provider?: string} | null>(null);
  const [email, setEmail] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Verificar si el usuario ya está autenticado al cargar el diálogo
  useEffect(() => {
    if (open) {
      const checkAuth = async () => {
        try {
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            console.log("Usuario ya autenticado en AuthDialog");
            setIsAuthenticated(true);
            // Guardar el rol del usuario
            const role = data.session.user.user_metadata?.role || 'user';
            setUserRole(role);
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Error verificando autenticación:", error);
          setIsAuthenticated(false);
        } finally {
          setCheckingAuth(false);
        }
      };
      
      checkAuth();
    }
  }, [open, navigate, onOpenChange]);

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
        // Intentamos determinar con qué proveedores se registró
        // Este método es básico y puede requerir mejoras
        
        // Para una implementación completa, necesitaríamos un endpoint en el servidor
        // que verifique los métodos de autenticación de un usuario
        
        // Por ahora, solo podemos decir que existe
        return { exists: true, provider: 'desconocido' };
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

      // La redirección es manejada por el proveedor de OAuth
      
    } catch (error: any) {
      console.error(`Error con inicio de sesión ${provider}:`, error);
      toast.error(`Error con ${provider}`, {
        description: error.message || `No se pudo iniciar sesión con ${provider}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = () => {
    onOpenChange(false);
    setShowLoginDialog(true);
  };

  const handleRegister = () => {
    onOpenChange(false);
    setShowRegisterDialog(true);
  };

  const handleLoginSuccess = () => {
    console.log("Login exitoso desde AuthDialog, redirigiendo");
    navigate('/dashboard');
  };

  const handleRegistrationSuccess = (userInfo: { fullName: string; email?: string }) => {
    toast.success("Registro completado", {
      description: `¡Bienvenido a VYBA, ${userInfo.fullName}!`
    });
    console.log("Registro exitoso, redirigiendo al dashboard");
    navigate('/dashboard');
  };

  const handleRedirectToDashboard = () => {
    onOpenChange(false);
    if (userRole === 'artist') {
      navigate('/dashboard');
    } else {
      navigate('/user-dashboard');
    }
  };

  // Si estamos verificando la autenticación, mostramos un loader mínimo
  if (checkingAuth && open) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Si el usuario ya está autenticado, mostrar un mensaje de alerta
  if (isAuthenticated && open) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-center">
              Sesión activa
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4 px-6">
            <Alert className="mb-4 bg-blue-50 border-blue-200">
              <Info className="h-5 w-5 text-blue-600" />
              <AlertTitle className="ml-2 text-blue-800">Ya has iniciado sesión</AlertTitle>
              <AlertDescription className="text-blue-700 mt-2">
                Ya tienes una sesión activa en VYBA. No es necesario volver a iniciar sesión.
              </AlertDescription>
            </Alert>
            
            <div className="flex justify-center mt-6">
              <Button onClick={handleRedirectToDashboard} className="w-full">
                Ir a mi dashboard
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex flex-col space-y-2 text-center mb-4">
              <DialogTitle>
                ¡Únete a la comunidad de VYBA!
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4 px-12">
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

            <div className="space-y-4">
              <Button 
                variant="secondary" 
                className="w-full flex items-center justify-center gap-2 bg-[#F7F7F7] text-black" 
                onClick={() => handleSocialLogin("google")} 
                disabled={isLoading}
              >
                <img src="/logos/google-logo.svg" alt="Google" width={20} height={20} />
                Continuar con Google
              </Button>
              
              <Button 
                variant="secondary" 
                className="w-full flex items-center justify-center gap-2 bg-[#F7F7F7] text-black" 
                onClick={() => handleSocialLogin("facebook")} 
                disabled={isLoading}
              >
                <img src="/logos/facebook-logo.svg" alt="Facebook" width={20} height={20} />
                Continuar con Facebook
              </Button>
              
              <Button 
                variant="secondary" 
                className="w-full flex items-center justify-center gap-2 bg-[#F7F7F7] text-black" 
                onClick={() => handleSocialLogin("apple")} 
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
                onClick={handleEmailLogin} 
                disabled={isLoading}
              >
                <Mail size={20} />
                Iniciar sesión con Mail
              </Button>
            </div>
            
            <div className="text-center text-sm mt-2">
              <p className="text-center text-sm mt-3 font-light">
                ¿No tienes cuenta? <Button variant="link" onClick={handleRegister} className="font-medium text-black p-0">Regístrate</Button>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <RegisterDialog
        open={showRegisterDialog}
        onOpenChange={setShowRegisterDialog}
        onSuccess={handleRegistrationSuccess}
      />

      <LoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default AuthDialog;
