
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import SocialAuthButtons from './SocialAuthButtons';
import EmailDivider from './EmailDivider';
import { Mail, ArrowLeft } from 'lucide-react';
import LoginForm from './LoginForm';

interface LoginSectionProps {
  loginForm: {
    email: string;
    password: string;
  };
  setLoginForm: React.Dispatch<React.SetStateAction<{
    email: string;
    password: string;
  }>>;
  isLoading: boolean;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  handleLoginSubmit: (e: React.FormEvent) => void;
  handleSocialLogin: (provider: string) => void;
  switchToRegister: () => void;
}

const LoginSection: React.FC<LoginSectionProps> = ({ 
  loginForm, 
  setLoginForm, 
  isLoading, 
  showPassword, 
  togglePasswordVisibility, 
  handleLoginSubmit,
  handleSocialLogin,
  switchToRegister
}) => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  
  const handleContinueWithEmail = () => {
    setShowLoginForm(true);
  };
  
  const handleBackToOptions = () => {
    setShowLoginForm(false);
  };

  return (
    <div>
      {!showLoginForm ? (
        // Pantalla inicial con opciones de inicio de sesión
        <div className="space-y-3">
          <SocialAuthButtons onSocialLogin={handleSocialLogin} />
          <EmailDivider />
          
          <Button 
            type="button" 
            variant="secondary" 
            className="w-full flex items-center justify-center py-3.5 gap-2" 
            onClick={handleContinueWithEmail}
          >
            <Mail size={20} />
            Continuar con Mail
          </Button>

          <div className="text-center mt-4 pt-2">
            <p className="text-sm text-gray-600">
              No tienes cuenta?
            </p>
            <Button 
              variant="secondary" 
              className="mt-2 w-full" 
              onClick={switchToRegister}
            >
              Regístrate
            </Button>
          </div>
        </div>
      ) : (
        // Formulario de inicio de sesión
        <div className="space-y-5">
          <LoginForm 
            loginForm={loginForm}
            setLoginForm={setLoginForm}
            isLoading={isLoading}
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
            handleLoginSubmit={handleLoginSubmit}
            handleBackToOptions={handleBackToOptions}
          />
          
          <div className="text-center mt-4 pt-2">
            <p className="text-sm text-gray-600">
              No tienes cuenta?
            </p>
            <Button 
              variant="secondary" 
              className="mt-2" 
              onClick={switchToRegister}
            >
              Regístrate
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginSection;
