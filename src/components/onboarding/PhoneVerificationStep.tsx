
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Smartphone } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface PhoneVerificationStepProps {
  onPhoneChange: (phone: string) => void;
  initialValue?: string;
}

const PhoneVerificationStep: React.FC<PhoneVerificationStepProps> = ({
  onPhoneChange,
  initialValue = ''
}) => {
  const [phone, setPhone] = useState(initialValue);
  const [countryCode, setCountryCode] = useState('+34');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Solo permitir números y algunos caracteres especiales
    if (/^[0-9\s]*$/.test(value) || value === '') {
      setPhone(value);
      onPhoneChange(countryCode + value);
    }
  };

  const handleSendCode = () => {
    if (phone.length < 9) {
      toast({
        title: "Número incorrecto",
        description: "Por favor, introduce un número de teléfono válido",
        variant: "destructive"
      });
      return;
    }

    // Simulación de envío de código
    setIsVerifying(true);
    
    setTimeout(() => {
      setIsVerifying(false);
      setIsCodeSent(true);
      toast({
        title: "Código enviado",
        description: "Te hemos enviado un código de verificación por SMS"
      });
    }, 1500);
  };

  const handleVerifyCode = () => {
    if (verificationCode.length !== 6) {
      toast({
        title: "Código incompleto",
        description: "Por favor, introduce el código de 6 dígitos completo",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    
    // Simulación de verificación (en producción aquí iría la llamada a la API)
    setTimeout(() => {
      setIsVerifying(false);
      toast({
        title: "Teléfono verificado",
        description: "Tu número de teléfono ha sido verificado correctamente"
      });
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full pt-28 px-4 md:px-8">
      <div className="max-w-md w-full text-center">
        <h2 className="text-4xl md:text-6xl font-black mb-6 dark:text-white">
          Escribe tu móvil
        </h2>
        <p className="text-gray-500 text-center mb-10">
          Es imprescindible que al crear un proyecto nuevo pongas tu móvil para poder verificar y proteger tu cuenta
        </p>
        
        <div className="bg-[#F7F7F7] dark:bg-vyba-dark-secondary/30 rounded-3xl p-8 md:p-12">
          {!isCodeSent ? (
            <div className="space-y-6">
              <div className="flex space-x-2">
                <div className="w-20">
                  <Input 
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="text-center font-medium"
                    readOnly
                  />
                </div>
                <div className="flex-1">
                  <Input 
                    type="tel"
                    placeholder="684 *** *** ***"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="font-medium"
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleSendCode}
                className="w-full"
                isLoading={isVerifying}
                disabled={phone.length < 9 || isVerifying}
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Enviar código
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-sm text-gray-500 mb-4">
                Introduce el código de 6 dígitos que hemos enviado a {countryCode} {phone}
              </p>
              
              <div className="flex justify-center mb-6">
                <InputOTP
                  maxLength={6}
                  value={verificationCode}
                  onChange={(value) => setVerificationCode(value)}
                  render={({ slots }) => (
                    <InputOTPGroup>
                      {slots.map((slot, index) => (
                        <InputOTPSlot key={index} {...slot} index={index} />
                      ))}
                    </InputOTPGroup>
                  )}
                />
              </div>
              
              <Button 
                onClick={handleVerifyCode}
                className="w-full"
                isLoading={isVerifying}
                disabled={verificationCode.length < 6 || isVerifying}
              >
                Verificar código
              </Button>
              
              <Button 
                variant="ghost"
                className="w-full mt-2"
                onClick={() => setIsCodeSent(false)}
                disabled={isVerifying}
              >
                Cambiar número
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhoneVerificationStep;
