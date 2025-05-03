
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

type Step = 'email' | 'verification' | 'registration';

interface RegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (userInfo: { fullName: string; email?: string }) => void;
}

const registrationSchema = z.object({
  name: z.string().min(1, "Nombre es requerido"),
  lastName: z.string().min(1, "Apellido es requerido"),
  birthDate: z.string().min(1, "Fecha de nacimiento es requerida"),
  password: z.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/\d/, "La contraseña debe contener al menos un número")
    .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "La contraseña debe contener al menos un carácter especial")
});

type RegistrationData = z.infer<typeof registrationSchema>;

const RegisterDialog = ({ open, onOpenChange, onSuccess }: RegisterDialogProps) => {
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [emailError, setEmailError] = useState<{message: string, provider?: string} | null>(null);
  const navigate = useNavigate();

  const form = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: '',
      lastName: '',
      birthDate: '',
      password: ''
    }
  });

  // Improved email existence check that accurately determines if an email exists
  const checkEmailExists = async (email: string) => {
    try {
      console.log("Checking if email exists:", email);
      
      // Verificar si el correo ya existe en la tabla de perfiles
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .maybeSingle();
      
      if (data) {
        console.log("Email exists in profiles table");
        return { exists: true, provider: 'email' };
      }
      
      // Intentar verificar si el usuario existe en auth sin intentar iniciar sesión
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false, // No crear un usuario si no existe
        }
      });
      
      // Si el error indica que el usuario no existe, entonces el email no está registrado
      if (signInError && signInError.message.includes("Email not found")) {
        console.log("Email does not exist based on OTP check");
        return { exists: false };
      }
      
      // Verificar directamente con la API de autenticación si el usuario existe
      // Esta es una verificación más precisa que las anteriores
      const { data: userData, error: userError } = await supabase.auth.admin.getUserByEmail(email);
      
      if (userData?.user) {
        console.log("Email exists based on auth API check");
        return { exists: true, provider: 'email' };
      }
      
      // Si ninguno de los métodos anteriores confirma que el usuario existe, asumimos que no existe
      console.log("Email does not exist after all checks");
      return { exists: false };
    } catch (error) {
      console.error("Error checking if email exists:", error);
      // En caso de errores inesperados, permitir el intento de registro
      return { exists: false };
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setEmailError(null);
    
    try {
      // Verify if the email already exists
      const emailCheck = await checkEmailExists(email);
      
      if (emailCheck.exists) {
        // If the email already exists, set error and stop the process
        let message = "Este email ya está registrado";
        if (emailCheck.provider) {
          message += ` con ${emailCheck.provider === 'email' ? 'correo y contraseña' : emailCheck.provider}`;
        }
        setEmailError({ message, provider: emailCheck.provider });
        setIsLoading(false);
        return;
      }
      
      // Continue with OTP code sending if the email doesn't exist
      const response = await fetch('https://zkucuolpubthcnsgjtso.supabase.co/functions/v1/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          action: 'send'
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar el código');
      }

      setCurrentStep('verification');
      toast.success("Código de verificación enviado", {
        description: "Por favor, revisa tu correo electrónico"
      });
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Error", {
        description: error.message || "No se pudo enviar el código de verificación"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setVerificationError(''); // Limpiar errores previos
    try {
      // Re-enviar el correo con el código OTP
      const response = await fetch('https://zkucuolpubthcnsgjtso.supabase.co/functions/v1/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          action: 'send'
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al reenviar el código');
      }

      toast.success("Código de verificación reenviado", {
        description: "Por favor, revisa tu correo electrónico"
      });
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Error", {
        description: error.message || "No se pudo reenviar el código de verificación"
      });
    } finally {
      setResendLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;

    setIsLoading(true);
    setVerificationError(''); // Limpiar errores previos
    try {
      // Verificar el código OTP
      const response = await fetch('https://zkucuolpubthcnsgjtso.supabase.co/functions/v1/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code,
          action: 'verify'
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error("Error de verificación:", {
          status: response.status,
          data
        });
        
        throw new Error(data.error || 'Código no válido');
      }

      // Marcar como verificado y avanzar al siguiente paso
      setIsVerified(true);
      setCurrentStep('registration');
      
      toast.success("Código verificado correctamente", {
        description: "Por favor, completa tu registro"
      });
    } catch (error: any) {
      console.error("Error de verificación:", error);
      
      // Mostrar un mensaje de error específico cuando el código es incorrecto
      setVerificationError("El código introducido no es correcto o ha expirado. Por favor, inténtalo de nuevo o solicita un nuevo código.");
      
      toast.error("Error", {
        description: error.message || "Código no válido o expirado"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: RegistrationData) => {
    if (!isVerified) {
      toast.error("Error", {
        description: "Debes verificar tu correo electrónico"
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Intentando registrar usuario con estos datos:", { email, ...data });
      
      // Registrar el usuario en Supabase con autoconfirm true para crear la cuenta inmediatamente
      const { data: authData, error } = await supabase.auth.signUp({
        email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            lastName: data.lastName,
            birthDate: data.birthDate,
            role: 'user', // Por defecto, el usuario es tipo 'user' (no artista)
            onboarding_completed: false // Marcar que necesita completar el onboarding
          },
          emailRedirectTo: window.location.origin + '/user-onboarding'
        }
      });

      if (error) {
        throw error;
      }

      console.log("Usuario registrado exitosamente:", authData);

      // Iniciar sesión inmediatamente después del registro
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: data.password,
      });

      if (signInError) {
        console.error("Error al iniciar sesión automáticamente:", signInError);
      }

      if (onSuccess) {
        onSuccess({ 
          fullName: `${data.name} ${data.lastName}`, 
          email 
        });
      }
      
      // Cerrar este diálogo automáticamente
      onOpenChange(false);
      
      toast.success("Registro completado", {
        description: "¡Bienvenido a VYBA!"
      });
      
      setTimeout(() => {
        setCurrentStep('email');
        setEmail('');
        setCode('');
        setIsVerified(false);
        form.reset();
      }, 300);

      // Redirigir al usuario directamente al onboarding
      navigate('/user-onboarding');
    } catch (error: any) {
      console.error("Error de registro:", error);
      toast.error("Error", {
        description: error.message || "No se pudo completar el registro"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 'verification') {
      setCurrentStep('email');
      setVerificationError('');
    } else if (currentStep === 'registration') {
      setCurrentStep('verification');
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setCurrentStep('email');
      setEmail('');
      setCode('');
      setIsVerified(false);
      setVerificationError('');
      form.reset();
    }, 300);
  };

  const passwordRequirements = [
    {
      label: "Al menos 8 caracteres",
      test: (pw: string) => pw.length >= 8,
    },
    {
      label: "Al menos 1 número",
      test: (pw: string) => /\d/.test(pw),
    },
    {
      label: "Al menos 1 letra mayúscula",
      test: (pw: string) => /[A-Z]/.test(pw),
    },
    {
      label: "Al menos 1 carácter especial",
      test: (pw: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pw),
    }
  ];

  const [validatedRules, setValidatedRules] = useState<number[]>([]);
  const [passwordValue, setPasswordValue] = useState('');

  const areAllRequirementsMet = passwordRequirements.every(
    (req) => req.test(passwordValue)
  );

  useEffect(() => {
    passwordRequirements.forEach((req, index) => {
      const isValid = req.test(passwordValue);
      const alreadyValidated = validatedRules.includes(index);
  
      if (isValid && !alreadyValidated) {
        setTimeout(() => {
          setValidatedRules((prev) => [...prev, index]);
        }, 500);
      } else if (!isValid && alreadyValidated) {
        setValidatedRules((prev) => prev.filter(i => i !== index));
      }
    });
  }, [passwordValue, validatedRules]);

  const handleRegistrationSuccess = async (userData: any) => {
    try {
      // Si el registro es exitoso, navegar directamente al onboarding
      toast.success('¡Registro exitoso!');
      
      // Pequeño retraso para permitir que se muestre el toast
      setTimeout(() => {
        navigate('/user-onboarding');
        onOpenChange(false);
      }, 1000);
    } catch (error) {
      console.error('Error post-registro:', error);
      toast.error('Error al procesar el registro');
    }
  };

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
            {currentStep === 'email' && 'Ingresa tu correo'}
            {currentStep === 'verification' && 'Verifica tu correo'}
            {currentStep === 'registration' && '¡Estás solo a un paso!'}
          </DialogTitle>
        </DialogHeader>

        {currentStep === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-8 px-12">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="ejemplo@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(null); // Limpiar error al cambiar el email
                }}
                required
                className={cn(
                  "focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-offset-0",
                  emailError ? "border-red-500" : ""
                )}
              />
              
              {emailError && (
                <Alert variant="destructive" className="mt-4 bg-red-50 text-red-800 border-none">
                  <AlertTitle className="text-red-800 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" /> Email ya registrado
                  </AlertTitle>
                  <AlertDescription className="text-red-700">
                    {emailError.message}. Por favor, inicia sesión en lugar de registrarte.
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <Button 
              variant="terciary"
              type="submit" 
              className="w-full"
              disabled={isLoading || !!emailError}
              isLoading={isLoading}
            >
              {isLoading ? "Enviando" : "Enviar código"}
            </Button>
          </form>
        )}

        {currentStep === 'verification' && (
          <form onSubmit={handleVerificationSubmit} className="space-y-8 px-12">
            <div className="flex flex-col items-center justify-center">
              <p className="text-sm font-light mb-4 text-black">
                Inserta el código que te hemos enviado por correo a {email}
              </p>
              <InputOTP
                value={code}
                onChange={(value) => {
                  setCode(value);
                  if (verificationError) setVerificationError(''); // Limpiar error al cambiar el código
                }}
                maxLength={6}
              >
                <InputOTPGroup className="gap-2">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="rounded-md bg-[#F7F7F7] w-10 h-12 text-center text-lg focus:ring-0 focus:outline-none"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              
              {verificationError && (
                <Alert variant="destructive" className="mt-8 bg-red-50 text-red-800 border-none">
                  <AlertTitle className="text-red-800 flex items-center gap-2 mb-4">
                    <XCircle className="h-4 w-4" /> Código incorrecto
                  </AlertTitle>
                  <AlertDescription className="text-red-700">
                    {verificationError}
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <div className="flex gap-2 justify-between">
              <Button 
                variant="secondary"
                type="button"
                onClick={handleResendCode}
                isLoading={resendLoading}
              >
                {resendLoading ? "Enviando" : "Volver a enviar"}
              </Button>
              <Button 
                variant="terciary"
                type="submit" 
                disabled={code.length !== 6 || isLoading}
                isLoading={isLoading}
                className="px-12"
              >
                {isLoading ? "Verificando" : "Verificar código"}
              </Button>
            </div>
          </form>
        )}

        {currentStep === 'registration' && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="px-12">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan" {...field} className="focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-offset-0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input placeholder="Pérez" {...field} className="focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-offset-0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Fecha de nacimiento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-offset-0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        value={passwordValue}
                        onChange={(e) => {
                          field.onChange(e);
                          setPasswordValue(e.target.value);
                        }}
                        className="focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-offset-0"
                      />
                    </FormControl>
                    <FormMessage />

                    {!areAllRequirementsMet && (
                      <ul className="mt-2 text-xs space-y-1">
                        {passwordRequirements.map((req, index) => {
                          const isValid = req.test(passwordValue);
                          return (
                            <li
                              key={index}
                              className={cn(
                                "flex items-center gap-2 transition-all duration-300 ease-in-out",
                                {
                                  "text-green-500": isValid,
                                  "text-[#C13515]": !isValid
                                }
                              )}
                            >
                              {isValid ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <XCircle className="w-4 h-4" />
                              )}
                              {req.label}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </FormItem>
                )}
              />

              <p className="text-xs text-black mb-4 font-light font-figtree">
                Al seleccionar <span className="font-semibold text-black">registrarse</span> se aceptan los términos y condiciones, la política de privacidad y la política de cookies de VYBA.
              </p>

              <div className="mt-8">
                <Button 
                  variant="terciary"
                  type="submit" 
                  className="w-full"
                  disabled={isLoading || !areAllRequirementsMet}
                  isLoading={isLoading}
                >
                  {isLoading ? "Registrando" : "Registrarse"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RegisterDialog;
