
import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface RegisterFormStep1Props {
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
}

const RegisterFormStep1: React.FC<RegisterFormStep1Props> = ({ 
  registerForm, 
  setRegisterForm, 
  isLoading, 
  showPassword, 
  togglePasswordVisibility, 
  handleRegisterSubmit 
}) => {
  return (
    <form onSubmit={handleRegisterSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="register-name" className="block text-sm font-medium dark:text-white">
          Nombre completo
        </label>
        <Input 
          id="register-name" 
          type="text" 
          value={registerForm.fullName} 
          onChange={e => setRegisterForm({
            ...registerForm,
            fullName: e.target.value
          })} 
          placeholder="Escribe tu nombre completo" 
          required 
          className="rounded-xl h-12 bg-white dark:bg-black dark:text-white" 
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="register-email" className="block text-sm font-medium dark:text-white">
            Email
          </label>
          <Input 
            id="register-email" 
            type="email" 
            value={registerForm.email} 
            onChange={e => setRegisterForm({
              ...registerForm,
              email: e.target.value
            })} 
            placeholder="Escribe tu correo" 
            required 
            className="rounded-xl h-12 bg-white dark:bg-black dark:text-white" 
          />
        </div>
        
        <div className="space-y-1.5">
          <label htmlFor="register-password" className="block text-sm font-medium dark:text-white">
            Contraseña
          </label>
          <div className="relative">
            <Input 
              id="register-password" 
              type={showPassword ? "text" : "password"} 
              value={registerForm.password} 
              onChange={e => setRegisterForm({
                ...registerForm,
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
      </div>
      
      <div className="flex justify-center mt-8">
        <Button type="submit" isLoading={isLoading}>
          Siguiente
        </Button>
      </div>
    </form>
  );
};

export default RegisterFormStep1;
