
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
  const [artistForm, setArtistForm] = useState({
    artistName: '',
    mainGenres: '',
    artistType: ''
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
    
    if (registerStep < 3) {
      setTimeout(() => {
        setIsLoading(false);
        setRegisterStep(registerStep + 1);
      }, 800);
      return;
    }
    
    setTimeout(() => {
      toast.success("Registro completado exitosamente", {
        description: "Gracias por registrarte en VYBA",
        position: "bottom-center"
      });
      
      setTimeout(() => {
        setIsLoading(false);
        if (registerForm.role === 'artist') {
          navigate('/thank-you', {
            state: {
              artistInfo: {
                ...registerForm,
                ...artistForm
              }
            }
          });
        } else {
          navigate('/seeker-thank-you', {
            state: {
              seekerInfo: registerForm
            }
          });
        }
      }, 500);
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
    if (registerStep > 1) {
      setRegisterStep(registerStep - 1);
    }
  };

  return (
    <PageTransition>
      <div className="bg-white dark:bg-vyba-dark-bg min-h-screen">
        <Navbar />
        <AuthContent 
          defaultTab={defaultTab}
          setDefaultTab={setDefaultTab}
          loginForm={loginForm}
          setLoginForm={setLoginForm}
          registerForm={registerForm}
          setRegisterForm={setRegisterForm}
          artistForm={artistForm}
          setArtistForm={setArtistForm}
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
