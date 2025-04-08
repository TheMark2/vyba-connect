
import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { 
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";

interface PhoneVerificationStepProps {
  onPhoneChange: (phone: string) => void;
  initialValue?: string;
}

const PhoneVerificationStep: React.FC<PhoneVerificationStepProps> = ({
  onPhoneChange,
  initialValue = '',
}) => {
  const [phone, setPhone] = useState(initialValue);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [verified, setVerified] = useState(false);
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
    onPhoneChange(e.target.value);
  };
  
  const handleSendCode = () => {
    // En un caso real, enviarías un código por SMS
    console.log('Enviando código al número:', phone);
    setShowOTP(true);
  };
  
  const handleOTPComplete = (value: string) => {
    setOtp(value);
    if (value.length === 6) {
      // En un caso real, verificarías el código
      console.log('Verificando código:', value);
      setTimeout(() => {
        setVerified(true);
      }, 1000);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-full w-full pt-28 px-4">
      <div className="max-w-md w-full text-center">
        <h2 className="text-3xl md:text-5xl font-black mb-6">
          Escribe tu móvil
        </h2>
        <p className="text-gray-500 mb-8">
          Es imprescindible que al crear un proyecto nuevo pongas tu móvil para poder verificar y proteger tu cuenta
        </p>
        
        <div className="w-full max-w-md mx-auto space-y-4">
          {!verified ? (
            <>
              <div className="flex gap-2 w-full">
                <div className="bg-[#F7F7F7] dark:bg-vyba-dark-secondary/30 rounded-lg px-4 flex items-center justify-center w-20">
                  <span className="text-sm font-medium">+34</span>
                </div>
                <Input
                  type="tel"
                  placeholder="684 *** *** ***"
                  className="flex-1"
                  value={phone}
                  onChange={handlePhoneChange}
                />
              </div>
              
              {showOTP ? (
                <div className="mt-6">
                  <p className="text-sm text-gray-500 mb-4">
                    Hemos enviado un código a tu móvil. Introdúcelo a continuación:
                  </p>
                  <div className="flex justify-center mt-2">
                    <InputOTP maxLength={6} value={otp} onChange={handleOTPComplete}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={handleSendCode}
                  disabled={!phone || phone.length < 9}
                  className="w-full bg-black text-white rounded-full py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  Enviar código
                </Button>
              )}
            </>
          ) : (
            <div className="bg-green-50 rounded-lg p-4 flex items-center justify-center gap-2">
              <Phone className="h-5 w-5 text-green-500" />
              <span className="text-green-700 font-medium">Número verificado correctamente</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhoneVerificationStep;
