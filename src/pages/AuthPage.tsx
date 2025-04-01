
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import Navbar from '@/components/Navbar';
import { PageTransition } from '@/components/ui/page-transition';
import AuthContent from '@/components/auth/AuthContent';
import { useIsMobile } from '@/hooks/use-mobile';

const AuthPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Estados
  const [defaultTab, setDefaultTab] = useState<string>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'artist'
  });
  const [registerStep, setRegisterStep] = useState(1);

  // Handlers
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      toast.success("Inicio de sesión exitoso", {
        description: "Redirigiendo a la página principal...",
        position: "bottom-center"
      });
      
      setTimeout(() => {
        setIsLoading(false);
        navigate('/');
      }, 500);
    }, 1000);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (registerStep < 2) {
      setTimeout(() => {
        setIsLoading(false);
        setRegisterStep(registerStep + 1);
      }, 800);
      return;
    }
    
    setTimeout(() => {
      navigate('/profile-info', {
        state: {
          role: registerForm.role
        }
      });
    }, 1000);
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`Iniciando sesión con ${provider}`, {
      description: "Esta función estará disponible próximamente",
      position: "bottom-center"
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleTabChange = (value: string) => {
    setDefaultTab(value);
    setRegisterStep(1);
  };

  const switchToRegister = () => {
    setDefaultTab("register");
    setRegisterStep(1);
  };

  const handleBackStep = () => {
    setRegisterStep(1);
  };

  return (
    <PageTransition>
      <Navbar />
      <div className={`bg-vyba-cream dark:bg-vyba-dark-bg flex items-center justify-center min-h-[90vh] ${isMobile ? 'px-4' : 'px-6 md:px-10 lg:px-14 xl:px-16'}`}>
        <AuthContent 
          defaultTab={defaultTab}
          setDefaultTab={setDefaultTab}
          loginForm={loginForm}
          setLoginForm={setLoginForm}
          registerForm={registerForm}
          setRegisterForm={setRegisterForm}
          registerStep={registerStep}
          setRegisterStep={setRegisterStep}
          isLoading={isLoading}
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
          handleLoginSubmit={handleLoginSubmit}
          handleRegisterSubmit={handleRegisterSubmit}
          handleSocialLogin={handleSocialLogin}
          handleTabChange={handleTabChange}
          switchToRegister={switchToRegister}
          handleBackStep={handleBackStep}
        />
      </div>
    </PageTransition>
  );
};

export default AuthPage;
