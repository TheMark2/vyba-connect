import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, CheckCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

type Step = 'email' | 'password';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (userData?: any) => void;
}

// Validación para el email
const emailSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
});

// Validación para la contraseña
const passwordSchema = z.object({
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const LoginDialog = ({ open, onOpenChange, onSuccess }: LoginDialogProps) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailVerificationTimeout, setEmailVerificationTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showVerified, setShowVerified] = useState<'verified' | 'not-registered' | 'google' | false>(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(false);
    setErrorMessage('');

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
            setEmailError(true);
            setErrorMessage('Este correo no está registrado');
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
    setErrorMessage('');
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setEmailError(true);
      setErrorMessage('Por favor, introduce tu email');
      return;
    }
    
    if (showVerified === 'not-registered') {
      setEmailError(true);
      setErrorMessage('Este correo no está registrado');
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
        // Si el error es que el correo no está registrado, mostrar mensaje claro
        if (error.message.includes("not found")) {
          setEmailError(true);
          setErrorMessage('Este correo no está registrado');
          toast.error("Este correo no está registrado");
          setIsLoading(false);
          return;
        }
        
        // Si el error es que el correo no está confirmado
        if (error.message.includes("Email not confirmed")) {
          setEmailError(true);
          setErrorMessage('Correo no confirmado. Por favor, confirma tu correo antes de iniciar sesión');
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
      setEmailError(true);
      setErrorMessage('Error al verificar el correo');
      toast.error("Error al verificar el correo");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setPasswordError(true);
      setErrorMessage('Por favor, introduce tu contraseña');
      return;
    }

    setIsLoggingIn(true);
    setLoginError(null);
    
    try {
      console.log("Intentando iniciar sesión con:", { email, password });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Error de inicio de sesión:", error);
        setPasswordError(true);
        setErrorMessage(
          error.message === "Invalid login credentials" 
            ? "Contraseña incorrecta" 
            : error.message
        );
        setIsLoggingIn(false);
        return;
      }
      
      toast.success("Inicio de sesión exitoso");
      
      // Navegar directamente al dashboard según el rol del usuario
      if (data.user.user_metadata?.role === 'artist') {
        navigate('/dashboard');
      } else {
        navigate('/user-dashboard');
      }
      
      if (onSuccess) {
        onSuccess(data.user);
      }
    } catch (error: any) {
      toast.error("Error al iniciar sesión");
      console.error("Error al iniciar sesión:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 'password') {
      setCurrentStep('email');
      setErrorMessage('');
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setCurrentStep('email');
      setEmail('');
      setPassword('');
      setErrorMessage('');
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
                error={emailError}
              />
              {emailError && <p className="text-sm text-[#C13515]">{errorMessage || 'Por favor, introduce tu email'}</p>}
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
                error={passwordError}
              />
              {passwordError && <p className="text-sm text-[#C13515]">{errorMessage || 'Por favor, introduce tu contraseña'}</p>}
              {errorMessage && !passwordError && <p className="text-sm text-[#C13515]">{errorMessage}</p>}
              <p className="text-xs text-gray-500">
                ¿Has olvidado tu contraseña? <span className="font-medium cursor-pointer">Recupérala aquí</span>
              </p>
            </div>
            <Button 
              variant="terciary"
              type="submit" 
              className="w-full"
              disabled={isLoggingIn}
              isLoading={isLoggingIn}
            >
              {isLoggingIn ? "Iniciando sesión" : "Iniciar sesión"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
