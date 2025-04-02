
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import Navbar from "@/components/Navbar";

const RegisterPage = () => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullNameError, setFullNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    setPassword(e.target.value);
    setPasswordError(false);
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
      // Proceder con el registro
      setIsLoading(true);
      console.log("Intentando registrar con:", fullName, email, password);
      
      // Simular un tiempo de carga
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-vyba-dark-bg">
      <Navbar />
      
      <div className="container mx-auto flex flex-col items-center justify-center px-6 py-20">
        <div className="w-full space-y-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black">Bienvenido/a a VYBA</h1>
            <p className="mt-3 text-2xl md:text-4xl">Regístrate</p>
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
              
              <Button 
                variant="secondary" 
                className="w-full flex items-center justify-center gap-2 bg-[#F7F7F7] text-black"
                onClick={handleShowEmailForm}
              >
                <Mail size={20} />
                Continuar con Mail
              </Button>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-6 mt-16 max-w-sm mx-auto">
              <div className="space-y-2">
                <label htmlFor="fullName" className={`block font-bold ${fullNameError ? 'text-[#C13515]' : ''}`}>Nombre completo</label>
                <Input 
                  id="fullName" 
                  type="text" 
                  placeholder="Ramón Prado" 
                  className="w-full bg-[#F7F7F7]" 
                  value={fullName}
                  onChange={handleFullNameChange}
                  error={fullNameError}
                />
                {fullNameError && <p className="text-sm text-[#C13515]">Por favor, introduce tu nombre completo</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className={`block font-bold ${emailError ? 'text-[#C13515]' : ''}`}>Email</label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="ramón.prado@vybapp.com" 
                  className="w-full bg-[#F7F7F7]" 
                  value={email}
                  onChange={handleEmailChange}
                  error={emailError}
                />
                {emailError && <p className="text-sm text-[#C13515]">Por favor, introduce tu email</p>}
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
                {passwordError && <p className="text-sm text-[#C13515]">Por favor, introduce una contraseña</p>}
              </div>
              
              <div className="w-full flex justify-center">
                <Button type="submit" className="px-16 bg-[#D4DDFF] text-black hover:bg-[#C6D0FF]" isLoading={isLoading}>
                  Registrarse
                </Button>
              </div>
              
              <div className="text-center text-sm">
                <p>Ya tienes cuenta. <Link to="/auth" className="font-bold">Iniciar Sesión</Link></p>
              </div>
            </form>
          )}
          
          {!showEmailForm && 
            <div className="text-center text-sm mt-6">
              <p>Ya tienes cuenta. <Link to="/auth" className="font-bold">Iniciar Sesión</Link></p>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
