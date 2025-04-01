
import React from 'react';
import { Button } from "@/components/ui/button";
import SocialAuthButtons from './SocialAuthButtons';
import EmailDivider from './EmailDivider';
import { Mail } from 'lucide-react';

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
  return (
    <div className="space-y-3">
      <SocialAuthButtons onSocialLogin={handleSocialLogin} />
      <EmailDivider />
      
      <Button 
        type="button" 
        variant="secondary" 
        className="w-full flex items-center justify-center gap-2" 
        onClick={handleLoginSubmit}
      >
        <Mail size={20} />
        Continuar con Mail
      </Button>

      <div className="text-center mt-4 pt-2">
        <p className="text-sm text-gray-600">
          No tienes cuenta? <Button variant="secondary" className="h-auto font-medium text-black bg-white px-3 py-1.5 ml-4" onClick={switchToRegister}>Regístrate</Button>
        </p>
      </div>
    </div>
  );
};

export default LoginSection;
