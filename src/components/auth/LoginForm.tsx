
import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
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
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  loginForm, 
  setLoginForm, 
  isLoading, 
  showPassword, 
  togglePasswordVisibility, 
  handleLoginSubmit 
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
          className="rounded-xl h-12 bg-white dark:bg-black dark:text-white" 
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
            className="rounded-xl h-12 pr-10 bg-white dark:bg-black dark:text-white" 
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
      <div className="flex">
        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full" 
            isLoading={isLoading}
          >
            Iniciar sesión
          </Button>
        </div>
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
      </div>
    </form>
  );
};

export default LoginForm;
