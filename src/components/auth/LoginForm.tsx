
import React from 'react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  handleBackToOptions: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  loginForm, 
  setLoginForm, 
  isLoading, 
  showPassword, 
  togglePasswordVisibility, 
  handleLoginSubmit,
  handleBackToOptions
}) => {
  return (
    <form onSubmit={handleLoginSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="login-email" className="block text-sm font-medium dark:text-white">
          Email
        </label>
        <Input 
          id="login-email" 
          type="email" 
          value={loginForm.email} 
          onChange={e => setLoginForm({
            ...loginForm,
            email: e.target.value
          })} 
          placeholder="Escribe tu correo" 
          required 
          className="rounded-xl h-12 bg-[#F7F7F7] dark:bg-[#F7F7F7] dark:text-white" 
        />
      </div>
      
      <div className="space-y-1.5">
        <label htmlFor="login-password" className="block text-sm font-medium dark:text-white">
          Contraseña
        </label>
        <div className="relative">
          <Input 
            id="login-password" 
            type={showPassword ? "text" : "password"} 
            value={loginForm.password} 
            onChange={e => setLoginForm({
              ...loginForm,
              password: e.target.value
            })} 
            placeholder="Escribe tu contraseña" 
            required 
            className="rounded-xl h-12 pr-10 bg-[#F7F7F7] dark:bg-[#F7F7F7] dark:text-white" 
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
      <div className="flex items-center gap-3">
        <Button 
          type="button" 
          variant="ghost" 
          className="p-3 bg-white hover:bg-gray-100 dark:bg-white dark:hover:bg-gray-100 dark:text-black" 
          onClick={handleBackToOptions}
        >
          <ArrowLeft size={20} />
        </Button>
        <Button 
          type="submit" 
          className="w-full" 
          isLoading={isLoading}
        >
          Iniciar sesión
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
