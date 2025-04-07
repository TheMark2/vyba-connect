
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import Navbar from "@/components/Navbar";

// Simular base de datos de emails
const mockEmailDatabase = {
  "usuario@vybapp.com": "verified",
  "google@vybapp.com": "google",
};

const AuthPage = () => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showVerified, setShowVerified] = useState<'verified' | 'not-registered' | 'google' | false>(false);
  const [emailVerificationTimeout, setEmailVerificationTimeout] = useState<NodeJS.Timeout | null>(null);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleShowEmailForm = () => {
    setShowEmailForm(true);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(false);
    
    // Limpiar el timeout anterior si existe
    if (emailVerificationTimeout) {
      clearTimeout(emailVerificationTimeout);
    }
    
    if (value) {
      // Si hay valor, configuramos un nuevo timeout para verificar el email después de 300ms
      const timeout = setTimeout(() => {
        // Simular verificación de email
        if (value in mockEmailDatabase) {
          setShowVerified(mockEmailDatabase[value as keyof typeof mockEmailDatabase] as 'verified' | 'google');
        } else {
          setShowVerified('not-registered');
        }
      }, 300);
      setEmailVerificationTimeout(timeout);
    } else {
      // Si el campo está vacío, ocultamos el icono
      setShowVerified(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    let hasError = false;
    
    if (!email) {
      setEmailError(true);
      hasError = true;
    }
    
    if (!password) {
      setPasswordError(true);
      hasError = true;
    }
    
    if (!hasError) {
      // Proceder con el login
      setIsLoading(true);
      console.log("Intentando iniciar sesión con:", email, password);
      
      // Simular un tiempo de carga
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  // Limpiar el timeout cuando se desmonte el componente
  useEffect(() => {
    return () => {
      if (emailVerificationTimeout) {
        clearTimeout(emailVerificationTimeout);
      }
    };
  }, [emailVerificationTimeout]);

  return (
    <main className="min-h-screen bg-white dark:bg-vyba-dark-bg flex flex-col">
      <Navbar />
      
      <div className="container mx-auto flex flex-col items-center px-6 pt-16 md:pt-12 pb-20 flex-1">
        <div className="w-full space-y-6 md:mt-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black">Bienvenido/a a VYBA</h1>
            {!showEmailForm ? <p className="mt-3 text-2xl md:text-4xl">Inicia sesión o regístrate</p> : <p className="mt-3 text-2xl md:text-4xl">Inicia sesión</p>}
          </div>

          {!showEmailForm ? (
            <div className="space-y-4 mt-16 max-w-sm mx-auto">
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
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6 mt-16 max-w-sm mx-auto">
              <div className="space-y-2">
                <label htmlFor="email" className={`block font-bold ${emailError ? 'text-[#C13515]' : ''}`}>Email</label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="ramón.prado@vybapp.com" 
                  className="w-full bg-[#F7F7F7]" 
                  value={email}
                  onChange={handleEmailChange}
                  showVerified={showVerified}
                  error={emailError}
                />
                {emailError && <p className="text-sm text-[#C13515]">Por favor, introduce tu email</p>}
                <p className="text-xs text-gray-500">
                  Prueba con: usuario@vybapp.com o google@vybapp.com
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className={`block font-bold ${passwordError ? 'text-[#C13515]' : ''}`}>Contraseña</label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full bg-[#F7F7F7]" 
                  value={password}
                  onChange={handlePasswordChange}
                  error={passwordError}
                />
                {passwordError && <p className="text-sm text-[#C13515]">Por favor, introduce tu contraseña</p>}
                <p className="text-xs text-gray-500">
                  ¿Has olvidado tu contraseña? <Link to="/reset-password" className="font-medium">Recupérala aquí</Link>
                </p>
              </div>
              <div className="w-full flex justify-center">
                <Button type="submit" className="px-16" isLoading={isLoading}>
                  Iniciar sesión
                </Button>
              </div>
              <div className="text-center text-sm">
                <p>No tienes cuenta. <Link to="/register" className="font-bold">Regístrate</Link></p>
              </div>
            </form>
          )}
          
          {!showEmailForm && <div className="text-center text-sm mt-6">
              <p>No tienes cuenta. <Link to="/register" className="font-bold">Regístrate</Link></p>
            </div>}
        </div>
      </div>
    </main>
  );
};
export default AuthPage;
