
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
  seekerFeatures
}) => {
  return (
    <form onSubmit={handleRegisterSubmit} className="space-y-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-center mb-6">¿Cómo quieres usar VYBA?</h2>
      </div>
      
      <RadioGroup 
        value={registerForm.role} 
        onValueChange={value => setRegisterForm({
          ...registerForm,
          role: value
        })} 
        className="space-y-3 py-2"
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
          variant="outline" 
          onClick={handleBackStep} 
          className="rounded-full p-3 border-none bg-white dark:bg-vyba-dark-secondary"
          disabled={isLoading}
        >
          <ArrowLeft size={20} strokeWidth={3} />
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Siguiente
        </Button>
      </div>
    </form>
  );
};

export default RegisterFormStep2;
