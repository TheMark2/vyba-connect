import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import WelcomeDialog from '@/components/WelcomeDialog';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullNameError, setFullNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [registeredUserInfo, setRegisteredUserInfo] = useState<{ fullName: string; email: string } | null>(null);

  const handleShowEmailForm = () => {
    setShowEmailForm(true);
  };

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
    setFullNameError(false);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError(false);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(false);

    if (newPassword.length === 0) {
      setPasswordStrength(null);
    } else if (newPassword.length < 6) {
      setPasswordStrength('weak');
    } else if (newPassword.length >= 6 && newPassword.length < 10) {
      setPasswordStrength('medium');
    } else {
      const hasUpperCase = /[A-Z]/.test(newPassword);
      const hasLowerCase = /[a-z]/.test(newPassword);
      const hasNumbers = /\d/.test(newPassword);
      if (hasUpperCase && hasLowerCase && hasNumbers) {
        setPasswordStrength('strong');
      } else {
        setPasswordStrength('medium');
      }
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;
    if (!fullName) {
      setFullNameError(true);
      hasError = true;
    }
    if (!email) {
      setEmailError(true);
      hasError = true;
    }
    if (!password) {
      setPasswordError(true);
      hasError = true;
    }
    if (!hasError) {
      setIsLoading(true);
      console.log("Intentando registrar con:", fullName, email, password);

      setTimeout(() => {
        setIsLoading(false);
        setRegisteredUserInfo({ fullName, email });
        setShowWelcomeDialog(true);
      }, 2000);
    }
  };

  const renderPasswordStrengthIndicator = () => {
    if (passwordStrength === null) return null;
    if (passwordStrength === 'weak') {
      return <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-[#EADBDB] ring-2 ring-[#EADBDB] rounded-full w-5 h-5 flex items-center justify-center transition-opacity duration-300 opacity-100">
          <div className="bg-[#ea384c] rounded-full w-2 h-2"></div>
        </div>;
    } else if (passwordStrength === 'medium') {
      return <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-[#FEC6A1] ring-2 ring-[#FEC6A1] rounded-full w-5 h-5 flex items-center justify-center transition-opacity duration-300 opacity-100">
          <div className="bg-[#FF9248] rounded-full w-2 h-2"></div>
        </div>;
    } else if (passwordStrength === 'strong') {
      return <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-[#F2FCE2] ring-2 ring-[#F2FCE2] rounded-full w-5 h-5 flex items-center justify-center transition-opacity duration-300 opacity-100">
          <div className="bg-[#4CAF50] rounded-full w-2 h-2"></div>
        </div>;
    }
  };

  const getPasswordRequirements = () => {
    if (!password || passwordStrength === null) return null;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const isLongEnough = password.length >= 10;
    if (passwordStrength === 'weak') {
      return <div className="text-xs text-[#ea384c]">
          Contraseña muy débil 
          {!isLongEnough && <span> - <strong>Añade {10 - password.length} caracteres más</strong></span>}
          {!hasUpperCase && <span> - <strong>Incluye al menos una mayúscula</strong></span>}
          {!hasLowerCase && <span> - <strong>Incluye al menos una minúscula</strong></span>}
          {!hasNumbers && <span> - <strong>Incluye al menos un número</strong></span>}
        </div>;
    } else if (passwordStrength === 'medium') {
      return <div className="text-xs text-[#FF9248]">
          Contraseña débil
          {!isLongEnough && <span> - <strong>Añade {10 - password.length} caracteres más</strong></span>}
          {!hasUpperCase && <span> - <strong>Incluye al menos una mayúscula</strong></span>}
          {!hasLowerCase && <span> - <strong>Incluye al menos una minúscula</strong></span>}
          {!hasNumbers && <span> - <strong>Incluye al menos un número</strong></span>}
        </div>;
    } else {
      return <div className="text-xs text-[#4CAF50]">Contraseña segura</div>;
    }
  };

  return <main className="min-h-screen bg-white dark:bg-vyba-dark-bg flex flex-col">
      <Navbar />
      
      <div className="container mx-auto flex flex-col items-center px-6 pt-24 md:pt-12 pb-20 flex-1 h-full justify-center">
        <div className="w-full space-y-6 md:mt-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Te damos la bienvenida a VYBA</h1>
          </div>

          {!showEmailForm ? <div className="space-y-4 mt-16 max-w-sm mx-auto">
              <Button variant="secondary" className="w-full flex items-center justify-center gap-2 bg-[#F7F7F7] text-black">
                <img src="/logos/google-logo.svg" alt="Google" width={20} height={20} />
                Continuar con Google
              </Button>
              
              <Button variant="secondary" className="w-full flex items-center justify-center gap-2 bg-[#F7F7F7] text-black">
                <img src="/logos/facebook-logo.svg" alt="Facebook" width={20} height={20} />
                Continuar con Facebook
              </Button>
              
              <Button variant="secondary" className="w-full flex items-center justify-center gap-2 bg-[#F7F7F7] text-black">
                <img src="/logos/apple-logo.svg" alt="Apple" width={20} height={20} />
                Continuar con Apple
              </Button>
              
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-600">o</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
              
              <Button variant="secondary" className="w-full flex items-center justify-center gap-2 bg-[#F7F7F7] text-black" onClick={handleShowEmailForm}>
                <Mail size={20} />
                Continuar con Mail
              </Button>
            </div> : <form onSubmit={handleRegister} className="space-y-6 mt-16 max-w-sm mx-auto">
              <div className="space-y-2">
                <label htmlFor="fullName" className={`block font-bold ${fullNameError ? 'text-[#C13515]' : ''}`}>Nombre completo</label>
                <Input id="fullName" type="text" placeholder="Ramón Prado" className="w-full bg-[#F7F7F7]" value={fullName} onChange={handleFullNameChange} error={fullNameError} />
                {fullNameError && <p className="text-sm text-[#C13515]">Por favor, introduce tu nombre completo</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className={`block font-bold ${emailError ? 'text-[#C13515]' : ''}`}>Email</label>
                <Input id="email" type="email" placeholder="ramón.prado@vybapp.com" className="w-full bg-[#F7F7F7]" value={email} onChange={handleEmailChange} error={emailError} />
                {emailError && <p className="text-sm text-[#C13515]">Por favor, introduce tu email</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className={`block font-bold ${passwordError ? 'text-[#C13515]' : ''}`}>Contraseña</label>
                <div className="relative">
                  <Input id="password" type="password" placeholder="••••••••" className="w-full bg-[#F7F7F7]" value={password} onChange={handlePasswordChange} error={passwordError} />
                  {renderPasswordStrengthIndicator()}
                </div>
                {passwordError && <p className="text-sm text-[#C13515]">Por favor, introduce una contraseña</p>}
                {getPasswordRequirements()}
              </div>
              
              <div className="w-full flex justify-center">
                <Button type="submit" className="px-16 bg-[#D4DDFF] text-black hover:bg-[#C6D0FF]" isLoading={isLoading}>
                  Registrarse
                </Button>
              </div>
              
              <div className="text-center text-sm">
                <p>Ya tienes cuenta. <Link to="/auth" className="font-bold">Iniciar Sesión</Link></p>
              </div>
            </form>}
          
          {!showEmailForm && <div className="text-center text-sm mt-6">
              <p className="text-center text-sm font-light">Ya tienes cuenta. <Link to="/auth" className="font-medium text-black">Iniciar Sesión</Link></p>
            </div>}
        </div>
      </div>

      {registeredUserInfo && (
        <WelcomeDialog
          open={showWelcomeDialog}
          onOpenChange={setShowWelcomeDialog}
          userInfo={registeredUserInfo}
        />
      )}
    </main>;
};

export default RegisterPage;
