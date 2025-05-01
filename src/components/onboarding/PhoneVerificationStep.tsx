import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, Check, X } from 'lucide-react';
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PhoneVerificationStepProps {
  onPhoneChange: (phone: string) => void;
  initialValue?: string;
  onComplete?: () => void;
}

const countries = [
  { code: 'ES', prefix: '+34', name: 'España' },
  { code: 'PT', prefix: '+351', name: 'Portugal' },
  { code: 'FR', prefix: '+33', name: 'Francia' },
  { code: 'IT', prefix: '+39', name: 'Italia' },
  { code: 'DE', prefix: '+49', name: 'Alemania' },
  { code: 'GB', prefix: '+44', name: 'Reino Unido' },
];

const PhoneVerificationStep: React.FC<PhoneVerificationStepProps> = ({ 
  onPhoneChange, 
  initialValue = '',
  onComplete 
}) => {
  const [phone, setPhone] = useState(initialValue);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [isCodeCorrect, setIsCodeCorrect] = useState(false);
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhone(value);
    onPhoneChange(`${selectedCountry.prefix}${value}`);
  };

  const handleCountryChange = (value: string) => {
    const country = countries.find(c => c.code === value);
    if (country) {
      setSelectedCountry(country);
      onPhoneChange(`${country.prefix}${phone}`);
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowVerificationDialog(true);
      toast.success("Código de verificación enviado", {
        description: "Por favor, revisa tu teléfono"
      });
    }, 1500);
  };

  const handleResendCode = () => {
    setResendLoading(true);
    setTimeout(() => {
      setResendLoading(false);
      toast.success("Código de verificación reenviado", {
        description: "Por favor, revisa tu teléfono"
      });
    }, 1500);
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowVerificationDialog(false);
      setShowConfirmationDialog(true);
      // Simulamos una verificación aleatoria para demostración
      const isCorrect = Math.random() > 0.5;
      setIsCodeCorrect(isCorrect);
      if (isCorrect) {
        toast.success("Teléfono verificado correctamente");
      } else {
        toast.error("Código incorrecto");
      }
    }, 1500);
  };

  const handleBack = () => {
    setShowVerificationDialog(false);
    setCode('');
  };

  const handleCloseConfirmation = () => {
    setShowConfirmationDialog(false);
    if (isCodeCorrect) {
      // Si el código es correcto, avanzamos al siguiente paso
      if (onComplete) {
        onComplete();
      }
      // Limpiamos el estado
      setPhone('');
      setCode('');
    } else {
      // Si el código es incorrecto, volvemos al diálogo de verificación
      setShowVerificationDialog(true);
    }
  };

  return (
    <>
      <div className="w-full max-w-6xl mx-auto">
        <div className="max-w-6xl mx-auto">
          <form onSubmit={handleSendCode} className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <div className="flex gap-2">
                <Select value={selectedCountry.code} onValueChange={handleCountryChange}>
                  <SelectTrigger className="w-[180px] rounded-lg">
                    <SelectValue placeholder="Selecciona país" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.prefix} {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="6XX XXX XXX"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="flex-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-offset-0"
                />
              </div>
            </div>
            {phone.length >= 9 && (
              <Button 
                variant="terciary"
                type="submit" 
                className="px-12"
                disabled={isLoading}
                isLoading={isLoading}
              >
                {isLoading ? "Enviando" : "Enviar código"}
              </Button>
            )}
          </form>
        </div>
      </div>

      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute left-4 top-4"
              onClick={handleBack}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <DialogTitle className="text-center">Verifica tu teléfono</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleVerificationSubmit} className="space-y-8 px-12">
            <div className="space-y-2 flex flex-col items-center justify-center">
              <p className="text-sm font-light mb-4 text-black">
                Inserta el código que te hemos enviado por SMS a {selectedCountry.prefix}{phone}
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
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirmationDialog} onOpenChange={handleCloseConfirmation}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-center">
              {isCodeCorrect ? "¡Código correcto!" : "Código incorrecto"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center space-y-6 px-12 py-4">
            <div className={`rounded-full p-4 ${isCodeCorrect ? 'bg-[#E4F9E4]' : 'bg-red-100'}`}>
              {isCodeCorrect ? (
                <Check className="h-8 w-8 text-green-500" />
              ) : (
                <X className="h-8 w-8 text-red-500" />
              )}
            </div>
            <p className="text-center text-sm font-light">
              {isCodeCorrect 
                ? "Tu teléfono ha sido verificado correctamente"
                : "El código introducido no es correcto. Por favor, inténtalo de nuevo."}
            </p>
            <Button 
              variant="terciary"
              onClick={handleCloseConfirmation}
              className="w-full"
            >
              {isCodeCorrect ? "Continuar" : "Volver a intentar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PhoneVerificationStep;