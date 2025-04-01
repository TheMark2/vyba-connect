
import React from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
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
  const seekerFeatures = [
    "Encuentra artistas según tus necesidades", 
    "Acceso completo al catálogo de profesionales", 
    "Comunícate directamente con los artistas"
  ];
  
  const artistFeatures = [
    "Crea tu perfil profesional", 
    "Recibe solicitudes de eventos", 
    "Gestiona tu calendario de actuaciones", 
    "Muestra tu portafolio a posibles clientes"
  ];

  return (
    <Card className={`border-none shadow-none bg-secondary dark:bg-vyba-dark-bg dark:border-vyba-dark-secondary rounded-3xl overflow-hidden w-full py-12 mx-auto ${isMobile ? 'px-4 py-6' : 'py-16'}`}>
      <div className={`text-center mb-8 max-w-2xl mx-auto ${isMobile ? 'px-4' : 'px-12'}`}>
        <AnimatePresence mode="wait">
          {registerStep === 2 && defaultTab === "register" ? (
            <motion.h1
              key="role-selection"
              className={`font-black mb-4 dark:text-white ${isMobile ? 'text-3xl' : 'text-6xl'}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              ¿Cómo quieres usar VYBA?
            </motion.h1>
          ) : (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className={`font-black mb-4 dark:text-white ${isMobile ? 'text-3xl' : 'text-6xl'}`}>Bienvenido/a a VYBA</h1>
              <p className={`dark:text-gray-300 ${isMobile ? 'text-xl' : 'text-4xl'}`}>Inicia sesión o regístrate</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Tabs defaultValue={defaultTab} value={defaultTab} onValueChange={handleTabChange} className={`mx-auto ${isMobile ? 'max-w-[90%] px-2' : 'max-w-2xl px-12'}`}>
        <TabsList className="hidden">
          <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
          <TabsTrigger value="register">Registrarse</TabsTrigger>
        </TabsList>
        
        <AnimatePresence mode="wait">
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
        </AnimatePresence>
      </Tabs>
    </Card>
  );
};

export default AuthContent;
