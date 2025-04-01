
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
            className="w-full flex items-center justify-center gap-2" 
            onClick={handleContinueWithEmail}
          >
            <Mail size={20} />
            Continuar con Mail
          </Button>

          <div className="text-center mt-4 pt-2">
            <p className="text-sm text-gray-600">
              No tienes cuenta? <Button variant="secondary" className="h-auto font-bold text-black bg-transparent hover:font-black ml-4" onClick={switchToRegister}>Regístrate</Button>
            </p>
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
          />
          
          <div className="flex justify-between items-center mt-4">
            <Button 
              type="button" 
              variant="ghost" 
              className="p-2" 
              onClick={handleBackToOptions}
            >
              <ArrowLeft size={20} />
            </Button>
          </div>
          <div className="text-center mt-4 pt-2">
            <p className="text-sm text-gray-600">
              No tienes cuenta? <Button variant="secondary" className="h-auto font-bold text-black bg-transparent hover:font-black ml-4" onClick={switchToRegister}>Regístrate</Button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginSection;
