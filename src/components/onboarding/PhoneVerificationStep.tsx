
import React, { useState, useEffect } from 'react';
import { Phone, Check, Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from '@/hooks/use-mobile';

interface PhoneVerificationStepProps {
  onPhoneChange: (phone: string) => void;
  initialValue?: string;
}

const PhoneVerificationStep: React.FC<PhoneVerificationStepProps> = ({
  onPhoneChange,
  initialValue = ''
}) => {
  const [phone, setPhone] = useState(initialValue);
  const [formattedPhone, setFormattedPhone] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [verified, setVerified] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Formatear número de teléfono automáticamente
  const formatPhoneNumber = (value: string) => {
    // Eliminar todos los caracteres no numéricos
    const numbersOnly = value.replace(/\D/g, '');
    
    // Aplicar formato XXX XXX XXX
    let formatted = '';
    for (let i = 0; i < numbersOnly.length && i < 9; i++) {
      if (i === 3 || i === 6) {
        formatted += ' ';
      }
      formatted += numbersOnly[i];
    }
    
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatPhoneNumber(inputValue);
    
    setFormattedPhone(formatted);
    // Guardar solo los números para el estado real
    const numbersOnly = formatted.replace(/\D/g, '');
    setPhone(numbersOnly);
    onPhoneChange(numbersOnly);
  };

  const handleSendCode = () => {
    // Simular envío de código con loading
    setIsSendingCode(true);
    
    // En un caso real, enviarías un código por SMS
    console.log('Enviando código al número:', phone);
    
    // Simular tiempo de carga
    setTimeout(() => {
      setIsSendingCode(false);
      setShowOTP(true);
      toast({
        title: "Código enviado",
        description: "Hemos enviado un código a tu teléfono móvil"
      });
    }, 1500);
  };

  const handleOTPComplete = (value: string) => {
    setOtp(value);
    if (value.length === 6) {
      // En un caso real, verificarías el código
      setIsVerifyingCode(true);
      console.log('Verificando código:', value);
      
      // Simular tiempo de verificación
      setTimeout(() => {
        setIsVerifyingCode(false);
        setVerified(true);
      }, 1500);
    }
  };

  const handleResendCode = () => {
    setIsSendingCode(true);
    console.log('Reenviando código al número:', phone);
    // Simular tiempo de carga
    setTimeout(() => {
      setIsSendingCode(false);
      toast({
        title: "Código reenviado",
        description: "Hemos enviado un nuevo código a tu teléfono móvil"
      });
    }, 1500);
  };

  return <div className="flex flex-col items-center w-full pt-8 px-4">
      <div className="max-w-md w-full text-center">
        {!verified ? <>
            {!showOTP ? <>
                <h2 className="text-4xl md:text-6xl font-black mb-6">
                  Escribe tu móvil
                </h2>
                <p className="text-gray-500 mb-8">
                  Es imprescindible que al crear un proyecto nuevo pongas tu móvil para poder verificar y proteger tu cuenta
                </p>
                
                <div className="w-full max-w-md mx-auto space-y-4 flex flex-col items-center">
                  <div className="flex gap-2 w-full justify-center">
                    <div className="bg-[#F7F7F7] dark:bg-vyba-dark-secondary/30 rounded-lg px-4 flex items-center justify-center w-20">
                      <span className="text-sm font-medium">+34</span>
                    </div>
                    <Input 
                      type="tel" 
                      placeholder="684 *** *** ***" 
                      className="flex-1" 
                      value={formattedPhone} 
                      onChange={handlePhoneChange} 
                      maxLength={11} // 9 dígitos + 2 espacios
                    />
                  </div>
                  
                  {phone.length === 9 && (
                    <Button 
                      onClick={handleSendCode} 
                      variant="default"
                      isLoading={isSendingCode}
                      disabled={isSendingCode}
                    >
                      Enviar código
                    </Button>
                  )}
                </div>
              </> : <>
                <h2 className="text-4xl md:text-6xl font-black mb-6">
                  Escribe el código
                </h2>
                <p className="text-gray-500 mb-8">
                  Hemos enviado un código a tu móvil. Introdúcelo a continuación.
                  {" "}
                  <span className="text-gray-500">
                    Si no te ha llegado,{" "}
                    <button 
                      onClick={handleResendCode} 
                      className="font-medium text-black dark:text-white underline"
                      disabled={isSendingCode}
                    >
                      {isSendingCode ? (
                        <>
                          <Loader2 className="inline-block w-4 h-4 mr-1 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        "Volver a enviar"
                      )}
                    </button>
                  </span>
                </p>
                
                <div className="flex justify-center mt-6 mb-8 relative">
                  <InputOTP 
                    maxLength={6} 
                    value={otp} 
                    onChange={handleOTPComplete}
                    disabled={isVerifyingCode}
                  >
                    <InputOTPGroup className="gap-4">
                      <InputOTPSlot index={0} className="w-14 h-14 rounded-lg border-0 bg-[#F7F7F7] dark:bg-vyba-dark-secondary/30" />
                      <InputOTPSlot index={1} className="w-14 h-14 rounded-lg border-0 bg-[#F7F7F7] dark:bg-vyba-dark-secondary/30" />
                      <InputOTPSlot index={2} className="w-14 h-14 rounded-lg border-0 bg-[#F7F7F7] dark:bg-vyba-dark-secondary/30" />
                      <InputOTPSlot index={3} className="w-14 h-14 rounded-lg border-0 bg-[#F7F7F7] dark:bg-vyba-dark-secondary/30" />
                      <InputOTPSlot index={4} className="w-14 h-14 rounded-lg border-0 bg-[#F7F7F7] dark:bg-vyba-dark-secondary/30" />
                      <InputOTPSlot index={5} className="w-14 h-14 rounded-lg border-0 bg-[#F7F7F7] dark:bg-vyba-dark-secondary/30" />
                    </InputOTPGroup>
                  </InputOTP>
                  {isVerifyingCode && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/10 backdrop-blur-[1px] rounded-lg">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  )}
                </div>
              </>}
          </> : <>
            <div className="flex flex-col items-center">
              <h2 className="text-4xl md:text-6xl font-black mb-6">
                Código correcto
              </h2>
              <p className="text-gray-400 mb-12">
                Puedes continuar
              </p>
              
              <div className="flex justify-center">
                <div className="bg-[#F7F7F7] rounded-full py-3 px-5 flex items-center gap-2.5">
                  <div className="bg-[#E4F9E4] rounded-full p-1.5">
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                  <span className="text-black font-medium">Código correcto</span>
                </div>
              </div>
            </div>
          </>}
      </div>
    </div>;
};

export default PhoneVerificationStep;
