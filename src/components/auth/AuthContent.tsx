
import React from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import LoginSection from './LoginSection';
import RegisterSection from './RegisterSection';

interface AuthContentProps {
  defaultTab: string;
  setDefaultTab: React.Dispatch<React.SetStateAction<string>>;
  loginForm: {
    email: string;
    password: string;
  };
  setLoginForm: React.Dispatch<React.SetStateAction<{
    email: string;
    password: string;
  }>>;
  registerForm: {
    fullName: string;
    email: string;
    password: string;
    role: string;
  };
  setRegisterForm: React.Dispatch<React.SetStateAction<{
    fullName: string;
    email: string;
    password: string;
    role: string;
  }>>;
  registerStep: number;
  setRegisterStep: React.Dispatch<React.SetStateAction<number>>;
  isLoading: boolean;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  handleLoginSubmit: (e: React.FormEvent) => void;
  handleRegisterSubmit: (e: React.FormEvent) => void;
  handleSocialLogin: (provider: string) => void;
  handleTabChange: (value: string) => void;
  switchToRegister: () => void;
  handleBackStep: () => void;
}

const AuthContent: React.FC<AuthContentProps> = ({
  defaultTab,
  setDefaultTab,
  loginForm,
  setLoginForm,
  registerForm,
  setRegisterForm,
  registerStep,
  setRegisterStep,
  isLoading,
  showPassword,
  togglePasswordVisibility,
  handleLoginSubmit,
  handleRegisterSubmit,
  handleSocialLogin,
  handleTabChange,
  switchToRegister,
  handleBackStep
}) => {
  const isMobile = useIsMobile();

  // Define the features for artists and seekers
  const seekerFeatures = ["Encuentra artistas según tus necesidades", "Acceso completo al catálogo de profesionales", "Comunícate directamente con los artistas"];
  const artistFeatures = ["Crea tu perfil profesional", "Recibe solicitudes de eventos", "Gestiona tu calendario de actuaciones", "Muestra tu portafolio a posibles clientes"];
  
  return (
    <div className={`w-full max-w-screen min-h-screen bg-[#f9f7f3] dark:bg-vyba-dark-bg ${isMobile ? 'py-8' : 'py-0'}`}>
      <div className="max-w-md mx-auto px-6 md:px-0 pt-10">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
          Bienvenido/a a VYBA
        </h1>
        <p className="text-xl text-center mb-8">
          Inicia sesión o regístrate
        </p>

        <Tabs defaultValue={defaultTab} value={defaultTab} onValueChange={handleTabChange}>
          <TabsList className="hidden">
            <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
            <TabsTrigger value="register">Registrarse</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" key="login">
            <LoginSection 
              loginForm={loginForm} 
              setLoginForm={setLoginForm} 
              isLoading={isLoading} 
              showPassword={showPassword} 
              togglePasswordVisibility={togglePasswordVisibility} 
              handleLoginSubmit={handleLoginSubmit} 
              handleSocialLogin={handleSocialLogin} 
              switchToRegister={switchToRegister} 
            />
          </TabsContent>

          <TabsContent value="register" key="register">
            <RegisterSection 
              registerStep={registerStep}
              registerForm={registerForm}
              setRegisterForm={setRegisterForm}
              isLoading={isLoading}
              showPassword={showPassword}
              togglePasswordVisibility={togglePasswordVisibility}
              handleRegisterSubmit={handleRegisterSubmit}
              handleSocialLogin={handleSocialLogin}
              handleBackStep={handleBackStep}
              switchToLogin={() => setDefaultTab("login")}
              artistFeatures={artistFeatures}
              seekerFeatures={seekerFeatures}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthContent;
