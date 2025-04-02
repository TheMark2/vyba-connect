
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Globe, MessageSquare, Laptop, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";

const AuthPage = () => {
  return (
    <div className="min-h-screen bg-vyba-cream dark:bg-vyba-dark-bg">
      <Navbar />
      
      <div className="container mx-auto flex flex-col items-center justify-center px-6 py-20">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-black">Bienvenido/a a VYBA</h1>
            <p className="mt-3 text-xl">Inicia sesión o regístrate</p>
          </div>
          
          <div className="space-y-4 mt-8">
            <Button 
              variant="secondary" 
              className="w-full flex items-center justify-center gap-2 bg-[#F7F7F7] text-black"
            >
              <Globe size={20} />
              Continuar con Google
            </Button>
            
            <Button 
              variant="secondary" 
              className="w-full flex items-center justify-center gap-2 bg-[#F7F7F7] text-black"
            >
              <MessageSquare size={20} />
              Continuar con Facebook
            </Button>
            
            <Button 
              variant="secondary" 
              className="w-full flex items-center justify-center gap-2 bg-[#F7F7F7] text-black"
            >
              <Laptop size={20} />
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
            >
              <Mail size={20} />
              Continuar con Mail
            </Button>
          </div>
          
          <div className="text-center text-sm mt-6">
            <p>No tienes cuenta. <Link to="/register" className="font-bold">Regístrate</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
