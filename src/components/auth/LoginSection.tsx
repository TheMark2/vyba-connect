
import React from 'react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { formVariants, itemVariants } from './animation-variants';
import SocialAuthButtons from './SocialAuthButtons';
import EmailDivider from './EmailDivider';
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
  return (
    <motion.div 
      className="space-y-6"
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <SocialAuthButtons onSocialLogin={handleSocialLogin} />
      <EmailDivider />
      <LoginForm 
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        isLoading={isLoading}
        showPassword={showPassword}
        togglePasswordVisibility={togglePasswordVisibility}
        handleLoginSubmit={handleLoginSubmit}
      />

      <motion.div variants={itemVariants} className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          No tienes cuenta? <Button variant="link" className="p-0 h-auto font-medium" onClick={switchToRegister}>Regístrate</Button>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default LoginSection;
