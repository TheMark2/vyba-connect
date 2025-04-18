
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import RegisterDialog from '@/components/auth/RegisterDialog';
import WelcomeDialog from '@/components/WelcomeDialog';

const RegisterPage = () => {
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [registeredUserInfo, setRegisteredUserInfo] = useState<{ fullName: string; email?: string }>({ fullName: '' });
  const navigate = useNavigate();

  const handleRegistrationSuccess = (userInfo: { fullName: string; email?: string }) => {
    setShowRegisterDialog(false);
    setRegisteredUserInfo(userInfo);
    setShowWelcomeDialog(true);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-vyba-dark-bg flex flex-col">
      <Navbar />

      <div className="container mx-auto flex flex-col items-center px-6 pt-24 md:pt-12 pb-20 flex-1 h-full justify-center">
        <div className="w-full space-y-6 md:mt-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Te damos la bienvenida a VYBA</h1>
          </div>

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
              onClick={() => setShowRegisterDialog(true)}
            >
              <Mail size={20} />
              Continuar con Mail
            </Button>
          </div>

          <div className="text-center text-sm mt-6">
            <p className="text-center text-sm font-light">
              Ya tienes cuenta. <Link to="/auth" className="font-medium text-black">Iniciar Sesión</Link>
            </p>
          </div>
        </div>
      </div>

      <RegisterDialog
        open={showRegisterDialog}
        onOpenChange={setShowRegisterDialog}
        onSuccess={handleRegistrationSuccess}
      />

      <WelcomeDialog 
        open={showWelcomeDialog}
        onOpenChange={setShowWelcomeDialog}
        userInfo={registeredUserInfo}
      />
    </main>
  );
};

export default RegisterPage;
