import React, { useState } from 'react';
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
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const form = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: '',
      lastName: '',
      birthDate: '',
      password: ''
    }
  });

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep('verification');
      toast.success("Código de verificación enviado", {
        description: "Por favor, revisa tu correo electrónico"
      });
    }, 1500);
  };

  const handleResendCode = () => {
    setResendLoading(true);
    setTimeout(() => {
      setResendLoading(false);
      toast.success("Código de verificación reenviado", {
        description: "Por favor, revisa tu correo electrónico"
      });
    }, 1500);
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep('registration');
    }, 1500);
  };

  const onSubmit = async (data: RegistrationData) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (onSuccess) {
        console.log("Llamando a onSuccess con:", { 
          fullName: `${data.name} ${data.lastName}`, 
          email 
        });
        onSuccess({ 
          fullName: `${data.name} ${data.lastName}`, 
          email 
        });
      }
      
      onOpenChange(false);
      
      toast.success("Registro completado", {
        description: "¡Bienvenido a VYBA!"
      });
      
      setTimeout(() => {
        setCurrentStep('email');
        setEmail('');
        setCode('');
        form.reset();
      }, 300);
    }, 1500);
  };

  const handleBack = () => {
    if (currentStep === 'verification') {
      setCurrentStep('email');
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

  React.useEffect(() => {
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
  }, [passwordValue]);

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
                onChange={(e) => setEmail(e.target.value)}
                required
                className="focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-offset-0"
              />
            </div>
            <Button 
              variant="terciary"
              type="submit" 
              className="w-full"
              disabled={isLoading}
              isLoading={isLoading}
            >
              {isLoading ? "Enviando" : "Enviar código"}
            </Button>
          </form>
        )}

        {currentStep === 'verification' && (
          <form onSubmit={handleVerificationSubmit} className="space-y-8 px-12">
            <div className="space-y-2 flex flex-col items-center justify-center">
              <p className="text-sm font-light mb-4 text-black">
                Inserta el código que te hemos enviado por correo a {email}
              </p>
              <InputOTP
                value={code}
                onChange={(value) => setCode(value)}
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

                    <ul className="mt-2 text-xs space-y-1">
                      {passwordRequirements.map((req, index) => {
                        const isValid = req.test(passwordValue);
                        const isValidated = validatedRules.includes(index);

                        return !isValidated ? (
                          <li
                            key={index}
                            className={cn(
                              "flex items-center gap-2 text-[#C13515] transition-all duration-700 ease-in-out",
                              {
                                "opacity-0 h-0 my-0 overflow-hidden pointer-events-none transform translate-y-[-10px]": isValid,
                                "opacity-100 h-auto transform translate-y-0": !isValid
                              }
                            )}
                          >
                            {isValid ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                            {req.label}
                          </li>
                        ) : null;
                      })}
                    </ul>

                  </FormItem>
                )}
              />

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
