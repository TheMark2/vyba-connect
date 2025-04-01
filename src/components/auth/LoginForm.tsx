
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { itemVariants } from './animation-variants';
import { useIsMobile } from "@/hooks/use-mobile";

interface LoginFormProps {
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
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  loginForm, 
  setLoginForm, 
  isLoading, 
  showPassword, 
  togglePasswordVisibility, 
  handleLoginSubmit 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <motion.form variants={itemVariants} onSubmit={handleLoginSubmit} className="space-y-4">
      <div className="space-y-1.5">
        {!isMobile ? (
          <label htmlFor="login-email" className="block text-sm font-medium dark:text-white">
            Email
          </label>
        ) : (
          <label htmlFor="login-email" className="block text-sm font-medium text-black">
            Email
          </label>
        )}
        <Input 
          id="login-email" 
          type="email" 
          value={loginForm.email} 
          onChange={e => setLoginForm({
            ...loginForm,
            email: e.target.value
          })} 
          placeholder={isMobile ? "Escribe tu correo" : "Email"} 
          required 
          className={`${isMobile ? 'rounded-full border-none h-12' : 'rounded-xl h-12'} bg-white dark:bg-black dark:text-white`} 
        />
      </div>
      
      <div className="space-y-1.5">
        {!isMobile ? (
          <label htmlFor="login-password" className="block text-sm font-medium dark:text-white">
            Contraseña
          </label>
        ) : (
          <label htmlFor="login-password" className="block text-sm font-medium text-black">
            Contraseña
          </label>
        )}
        <div className="relative">
          <Input 
            id="login-password" 
            type={showPassword ? "text" : "password"} 
            value={loginForm.password} 
            onChange={e => setLoginForm({
              ...loginForm,
              password: e.target.value
            })} 
            placeholder={isMobile ? "Escribe tu contraseña" : "Contraseña"}
            required 
            className={`${isMobile ? 'rounded-full border-none h-12' : 'rounded-xl h-12'} pr-10 bg-white dark:bg-black dark:text-white`}
          />
          <button 
            type="button" 
            onClick={togglePasswordVisibility} 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      
      <div className="flex justify-center mt-8">
        <Button type="submit" isLoading={isLoading} className={isMobile ? "w-full rounded-full" : ""}>
          Iniciar sesión
        </Button>
      </div>
    </motion.form>
  );
};

export default LoginForm;
