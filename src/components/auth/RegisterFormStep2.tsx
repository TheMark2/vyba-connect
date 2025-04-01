
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RoleSelector } from '@/components/ui/radio-group';

interface RegisterFormStep2Props {
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
  handleRegisterSubmit: (e: React.FormEvent) => void;
  handleBackStep: () => void;
  artistFeatures: string[];
  seekerFeatures: string[];
}

const RegisterFormStep2: React.FC<RegisterFormStep2Props> = ({ 
  registerForm, 
  setRegisterForm, 
  isLoading, 
  handleRegisterSubmit, 
  handleBackStep,
  artistFeatures,
  seekerFeatures,
}) => {
  return (
    <form onSubmit={handleRegisterSubmit} className="space-y-8">
      
      <RadioGroup 
        value={registerForm.role} 
        onValueChange={value => setRegisterForm({
          ...registerForm,
          role: value
        })} 
        className="gap-2"
      >
        <RoleSelector 
          value="artist" 
          label="Entrar como artista" 
          features={artistFeatures}
        />
        <RoleSelector 
          value="seeker" 
          label="Entrar como buscador" 
          features={seekerFeatures}
        />
      </RadioGroup>
      
      <div className="flex justify-center items-center gap-3 mt-8">
        <Button 
          type="button" 
          variant="secondary" 
          onClick={handleBackStep} 
          className="p-3 bg-white hover:bg-gray-100 dark:bg-white dark:hover:bg-gray-100 dark:text-black"
          disabled={isLoading}
        >
          <ArrowLeft size={20}/>
        </Button>
        <Button type="submit" isLoading={isLoading} className="w-full">
          Siguiente
        </Button>
      </div>
            <div className="text-center mt-4 pt-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          ¿Tienes cuenta?
        </p>
        <Button 
          variant="secondary" 
          className="mt-2 text-xs font-bold" 
          onClick={switchToLogin}
        >
          Iniciar Sesión
        </Button>
      </div>
    </form>
  );
};

export default RegisterFormStep2;
