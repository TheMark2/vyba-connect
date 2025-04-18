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

type Step = 'email' | 'verification' | 'registration';

interface RegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (userInfo: { fullName: string; email?: string }) => void;
}

const registrationSchema = z.object({
  name: z.string().min(1, "Nombre es requerido"),
  lastName: z.string().min(1, "Apellido es requerido"),
  birthDate: z.string().min(1, "Fecha de nacimiento es requerida")
});

type RegistrationData = z.infer<typeof registrationSchema>;

const RegisterDialog = ({ open, onOpenChange, onSuccess }: RegisterDialogProps) => {
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: '',
      lastName: '',
      birthDate: ''
    }
  });

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    // Simulamos envío de código
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep('verification');
      toast.success("Código de verificación enviado", {
        description: "Por favor, revisa tu correo electrónico"
      });
    }, 1500);
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;

    setIsLoading(true);
    // Simulamos verificación
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep('registration');
    }, 1500);
  };

  const onSubmit = async (data: RegistrationData) => {
    setIsLoading(true);
    // Simulamos registro
    setTimeout(() => {
      setIsLoading(false);
      onOpenChange(false);
      if (onSuccess) onSuccess({ 
        fullName: `${data.name} ${data.lastName}`, 
        email 
      });
      toast.success("Registro completado", {
        description: "¡Bienvenido a VYBA!"
      });
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
    setCurrentStep('email');
    setEmail('');
    setCode('');
    form.reset();
  };

  // Renderizar el componente OTP de manera segura
  const renderOTPInput = () => {
    return (
      <InputOTP
        value={code}
        onChange={(value) => setCode(value)}
        maxLength={6}
        render={({ slots }) => (
          <InputOTPGroup className="gap-2">
            {slots.map((slot, index) => (
              <InputOTPSlot
                key={index}
                {...slot}
                index={index}
                className="rounded-md bg-[#F7F7F7] w-10 h-12 text-center text-lg"
              />
            ))}
          </InputOTPGroup>
        )}
      />
    );
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
                onChange={(e) => setEmail(e.target.value)}
                required
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
              {renderOTPInput()}
            </div>
            <div className="flex gap-2 justify-between">
            <Button 
                variant="secondary"
                type="submit" 
              >
                Mas opciones
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-12">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input placeholder="Pérez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de nacimiento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
            <div className="px-12 mt-8">
              <Button 
                variant="terciary"
                type="submit" 
                className="w-full"
                disabled={isLoading}
                isLoading={isLoading}
              >
                {isLoading ? "Registrando..." : "Registrarse"}
              </Button>
            </div>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RegisterDialog;
