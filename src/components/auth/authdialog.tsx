import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import RegisterDialog from './RegisterDialog';
import LoginDialog from './LoginDialog';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthDialog = ({ open, onOpenChange }: AuthDialogProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);

    // Simulación de inicio de sesión
    setTimeout(() => {
      setIsLoading(false);
      onOpenChange(false);
      toast.success(`Sesión iniciada con ${provider}`, {
        description: "¡Bienvenido de nuevo a VYBA!"
      });
      
      // Lógica para recordar la acción que el usuario quería hacer antes de iniciar sesión
      // Por ejemplo, si quería dar like a un artista, realizarlo aquí
    }, 1500);
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
    // Redirigir al usuario después del inicio de sesión exitoso
    // o realizar la acción que quería hacer (por ejemplo, dar like)
    toast.success("Inicio de sesión exitoso", {
      description: "¡Bienvenido de nuevo a VYBA!"
    });
  };

  const handleRegistrationSuccess = (userInfo: { fullName: string; email?: string }) => {
    toast.success("Registro completado", {
      description: `¡Bienvenido a VYBA, ${userInfo.fullName}!`
    });
    // Aquí también se podría realizar la acción que el usuario quería hacer
  };

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
            <div className="space-y-4">
              <Button 
                variant="secondary" 
                className="w-full flex items-center justify-center gap-2 bg-[#F7F7F7] text-black" 
                onClick={() => handleSocialLogin("Google")} 
                disabled={isLoading}
              >
                <img src="/logos/google-logo.svg" alt="Google" width={20} height={20} />
                Continuar con Google
              </Button>
              
              <Button 
                variant="secondary" 
                className="w-full flex items-center justify-center gap-2 bg-[#F7F7F7] text-black" 
                onClick={() => handleSocialLogin("Facebook")} 
                disabled={isLoading}
              >
                <img src="/logos/facebook-logo.svg" alt="Facebook" width={20} height={20} />
                Continuar con Facebook
              </Button>
              
              <Button 
                variant="secondary" 
                className="w-full flex items-center justify-center gap-2 bg-[#F7F7F7] text-black" 
                onClick={() => handleSocialLogin("Apple")} 
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