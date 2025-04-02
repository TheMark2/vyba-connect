import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
const AuthPage = () => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const handleShowEmailForm = () => {
    setShowEmailForm(true);
  };
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
                <Input id="email" type="email" placeholder="ramón.prado@vybapp.com" className="w-full h-14 bg-[#F7F7F7]" />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block font-bold">Contraseña</label>
                <Input id="password" type="password" placeholder="••••••••" className="w-full h-14 bg-[#F7F7F7]" />
              </div>

              <Button className="w-md mx-auto">
                Iniciar sesión
              </Button>

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