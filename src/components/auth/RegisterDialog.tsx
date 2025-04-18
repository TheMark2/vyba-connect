
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";

type Step = 'email' | 'verification' | 'registration';

interface RegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEmailSubmit?: (email: string) => void;
  onVerificationComplete?: () => void;
  onClose?: () => void;
}

const RegisterDialog = ({ open, onOpenChange, onEmailSubmit, onVerificationComplete, onClose }: RegisterDialogProps) => {
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    // Simulamos envío de código
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep('verification');
      toast.success("Código de verificación enviado", {
        position: "bottom-center"
      });
      if (onEmailSubmit) onEmailSubmit(email);
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
      if (onVerificationComplete) onVerificationComplete();
    }, 1500);
  };

  const handleBack = () => {
    if (currentStep === 'verification') {
      setCurrentStep('email');
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setCurrentStep('email');
    setEmail('');
    setCode('');
    if (onClose) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px]">
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
            {currentStep === 'email' && 'Ingresa tu email'}
            {currentStep === 'verification' && 'Verifica tu email'}
            {currentStep === 'registration' && 'Completa tu registro'}
          </DialogTitle>
        </DialogHeader>

        {currentStep === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
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
              type="submit" 
              className="w-full"
              isLoading={isLoading}
            >
              Continuar
            </Button>
          </form>
        )}

        {currentStep === 'verification' && (
          <form onSubmit={handleVerificationSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Código de verificación</Label>
              <p className="text-sm text-gray-500">
                Te hemos enviado un código a {email}
              </p>
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
                        className={`rounded-md border-gray-200 bg-white w-10 h-12 text-center text-lg`}
                      />
                    ))}
                  </InputOTPGroup>
                )}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full"
              isLoading={isLoading}
              disabled={code.length !== 6}
            >
              Verificar
            </Button>
          </form>
        )}

        {currentStep === 'registration' && (
          <div className="text-center py-4">
            <p>Email verificado correctamente</p>
            <p className="text-sm text-gray-500 mt-2">
              Continúa con el registro
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RegisterDialog;
