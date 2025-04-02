
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import Navbar from "@/components/Navbar";

const AuthPage = () => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [showVerified, setShowVerified] = useState(false);
  const [emailVerificationTimeout, setEmailVerificationTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const handleShowEmailForm = () => {
    setShowEmailForm(true);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    // Limpiar el timeout anterior si existe
    if (emailVerificationTimeout) {
      clearTimeout(emailVerificationTimeout);
    }
    
    if (value) {
      // Si hay valor, configuramos un nuevo timeout para mostrar el ícono después de 300ms
      const timeout = setTimeout(() => {
        setShowVerified(true);
      }, 300);
      setEmailVerificationTimeout(timeout);
    } else {
      // Si el campo está vacío, ocultamos el icono
      setShowVerified(false);
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

  return <div className="min-h-screen bg-white dark:bg-vyba-dark-bg">
      <Navbar />
      
      <div className="container mx-auto flex flex-col items-center justify-center px-6 py-20">
        <div className="w-full space-y-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black">Bienvenido/a a VYBA</h1>
            {!showEmailForm ? <p className="mt-3 text-2xl md:text-4xl">Inicia sesión o regístrate</p> : <p className="mt-3 text-2xl md:text-4xl">Inicia sesión</p>}
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
            </div> : <div className="space-y-6 mt-16 max-w-sm mx-auto">
              <div className="space-y-2">
                <label htmlFor="email" className="block font-bold">Email</label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="ramón.prado@vybapp.com" 
                  className="w-full bg-[#F7F7F7]" 
                  value={email}
                  onChange={handleEmailChange}
                  showVerified={showVerified}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block font-bold">Contraseña</label>
                <Input id="password" type="password" placeholder="••••••••" className="w-full bg-[#F7F7F7]" />
              </div>
              <div className="w-full flex justify-center">
                <Button className="px-16">
                  Iniciar sesión
                </Button>
              </div>
              <div className="text-center text-sm">
                <p>No tienes cuenta. <Link to="/register" className="font-bold">Regístrate</Link></p>
              </div>
            </div>}
          
          {!showEmailForm && <div className="text-center text-sm mt-6">
              <p>No tienes cuenta. <Link to="/register" className="font-bold">Regístrate</Link></p>
            </div>}
        </div>
      </div>
    </div>;
};
export default AuthPage;
