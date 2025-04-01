
import React from 'react';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { formVariants, itemVariants } from './animation-variants';
import SocialAuthButtons from './SocialAuthButtons';
import EmailDivider from './EmailDivider';
import RegisterFormStep1 from './RegisterFormStep1';
import RegisterFormStep2 from './RegisterFormStep2';

interface RegisterSectionProps {
  registerStep: number;
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
  isLoading: boolean;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  handleRegisterSubmit: (e: React.FormEvent) => void;
  handleSocialLogin: (provider: string) => void;
  handleBackStep: () => void;
  switchToLogin: () => void;
  artistFeatures: string[];
  seekerFeatures: string[];
}

const RegisterSection: React.FC<RegisterSectionProps> = ({
  registerStep,
  registerForm,
  setRegisterForm,
  isLoading,
  showPassword,
  togglePasswordVisibility,
  handleRegisterSubmit,
  handleSocialLogin,
  handleBackStep,
  switchToLogin,
  artistFeatures,
  seekerFeatures
}) => {
  return (
    <AnimatePresence mode="wait">
      {registerStep === 1 ? (
        <motion.div 
          className="space-y-6"
          key="register-step-1"
          variants={formVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <SocialAuthButtons onSocialLogin={handleSocialLogin} />
          <EmailDivider />
          <RegisterFormStep1 
            registerForm={registerForm}
            setRegisterForm={setRegisterForm}
            isLoading={isLoading}
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
            handleRegisterSubmit={handleRegisterSubmit}
          />
        </motion.div>
      ) : registerStep === 2 ? (
        <motion.div 
          className="space-y-6"
          key="register-step-2"
          variants={formVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <RegisterFormStep2 
            registerForm={registerForm}
            setRegisterForm={setRegisterForm}
            isLoading={isLoading}
            handleRegisterSubmit={handleRegisterSubmit}
            handleBackStep={handleBackStep}
            artistFeatures={artistFeatures}
            seekerFeatures={seekerFeatures}
          />
          
          <motion.div variants={itemVariants} className="text-center mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ya tienes una cuenta? <Button variant="link" className="p-0 h-auto font-medium" onClick={switchToLogin}>Iniciar Sesión</Button>
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default RegisterSection;
