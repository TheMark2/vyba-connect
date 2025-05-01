
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

type Step = 'email' | 'password';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const LoginDialog = ({ open, onOpenChange, onSuccess }: LoginDialogProps) => {
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailVerificationTimeout, setEmailVerificationTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showVerified, setShowVerified] = useState<'verified' | 'not-registered' | 'google' | false>(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(false);

    if (emailVerificationTimeout) {
      clearTimeout(emailVerificationTimeout);
    }
    
    if (value) {
      // Verificar si el correo existe en Supabase
      const timeout = setTimeout(async () => {
        try {
          const { data, error } = await supabase.auth.signInWithOtp({
            email: value,
            options: {
              shouldCreateUser: false
            }
          });

          // Si no hay error, significa que el usuario existe
          if (!error) {
            setShowVerified('verified');
          } else if (error.message.includes("not found")) {
            setShowVerified('not-registered');
          }
        } catch (err) {
          console.error("Error al verificar email:", err);
          setShowVerified(false);
        }
      }, 600);
      
      setEmailVerificationTimeout(timeout);
    } else {
      setShowVerified(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError(false);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setEmailError(true);
      return;
    }
    
    if (showVerified === 'not-registered') {
      toast.error("Este correo no está registrado");
      return;
    }
    
    setIsLoading(true);
    try {
      // Verificar si el email existe
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: false
        }
      });

      if (error) {
        // Si el error es que el correo no está registrado
        if (error.message.includes("not found")) {
          toast.error("Este correo no está registrado");
          setIsLoading(false);
          return;
        }
        
        // Si el error es que el correo no está confirmado
        if (error.message.includes("Email not confirmed")) {
          toast.error("Correo no confirmado", {
            description: "Por favor, confirma tu correo electrónico antes de iniciar sesión"
          });
          setIsLoading(false);
          return;
        }
        
        throw error;
      }
      
      setCurrentStep('password');
    } catch (error: any) {
      console.error("Error al verificar email:", error);
      toast.error("Error al verificar el correo");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setPasswordError(true);
      return;
    }

    setIsLoading(true);
    try {
      console.log("Intentando iniciar sesión con:", { email, password });
      
      // Iniciar sesión con Supabase - usamos try/catch para capturar errores de red también
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log("Respuesta de signInWithPassword:", { data, error });

      // Manejar errores específicos
      if (error) {
        if (error.message.includes("Email not confirmed")) {
          toast.error("Correo no confirmado", {
            description: "Por favor, confirma tu correo electrónico antes de iniciar sesión"
          });
        } else if (error.message.includes("Invalid login")) {
          toast.error("Contraseña incorrecta");
        } else {
          toast.error(`Error de inicio de sesión: ${error.message}`);
        }
        console.error("Error de autenticación:", error);
        setIsLoading(false);
        return;
      }

      // Si llegamos aquí, significa que el inicio de sesión fue exitoso
      console.log("Inicio de sesión exitoso, usuario:", data?.user);
      
      // Llamar al callback de éxito si existe
      if (onSuccess) {
        onSuccess();
      }
      
      // Cerrar el diálogo
      onOpenChange(false);
      
      // Mostrar mensaje de éxito
      toast.success("Inicio de sesión exitoso", {
        description: "¡Bienvenido de nuevo a VYBA!"
      });
      
      // Reiniciar el formulario después de un pequeño retraso
      setTimeout(() => {
        setCurrentStep('email');
        setEmail('');
        setPassword('');
      }, 300);
    } catch (error: any) {
      // Capturar errores generales (como problemas de red)
      console.error("Error al iniciar sesión:", error);
      toast.error("Error de conexión", {
        description: "No se pudo conectar con el servidor. Por favor, inténtalo más tarde."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 'password') {
      setCurrentStep('email');
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setCurrentStep('email');
      setEmail('');
      setPassword('');
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (emailVerificationTimeout) {
        clearTimeout(emailVerificationTimeout);
      }
    };
  }, [emailVerificationTimeout]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          {currentStep !== 'email' && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute left-4 top-4"
              onClick={handleBack}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          <DialogTitle className="text-center">
            {currentStep === 'email' && 'Iniciar sesión con email'}
            {currentStep === 'password' && 'Introduce tu contraseña'}
          </DialogTitle>
        </DialogHeader>

        {currentStep === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-8 px-12">
            <div className="space-y-2">
              <Label htmlFor="email" className={cn({
                "text-[#C13515]": emailError
              })}>Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="ejemplo@email.com"
                value={email}
                onChange={handleEmailChange}
                required
                className={cn(
                  "focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-offset-0",
                  emailError && "border-[#C13515]"
                )}
              />
              {emailError && <p className="text-sm text-[#C13515]">Por favor, introduce tu email</p>}
            </div>
            <Button 
              variant="terciary"
              type="submit" 
              className="w-full"
              disabled={isLoading}
              isLoading={isLoading}
            >
              {isLoading ? "Verificando" : "Continuar"}
            </Button>
          </form>
        )}

        {currentStep === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-8 px-12">
            <div className="space-y-2">
              <div className="text-sm font-medium mb-4 text-black text-center">
                <p>Introduce la contraseña para <span className="font-semibold">{email}</span></p>
              </div>
              <Label htmlFor="password" className={cn({
                "text-[#C13515]": passwordError
              })}>Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={handlePasswordChange}
                required
                className={cn(
                  "focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-offset-0",
                  passwordError && "border-[#C13515]"
                )}
              />
              {passwordError && <p className="text-sm text-[#C13515]">Por favor, introduce tu contraseña</p>}
              <p className="text-xs text-gray-500">
                ¿Has olvidado tu contraseña? <span className="font-medium cursor-pointer">Recupérala aquí</span>
              </p>
            </div>
            <Button 
              variant="terciary"
              type="submit" 
              className="w-full"
              disabled={isLoading}
              isLoading={isLoading}
            >
              {isLoading ? "Iniciando sesión" : "Iniciar sesión"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
