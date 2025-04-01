
import React from 'react';
import { Music, Search, ArrowLeft } from 'lucide-react';
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
      <div className="space-y-4">
        <RadioGroup 
          value={registerForm.role} 
          onValueChange={value => setRegisterForm({
            ...registerForm,
            role: value
          })} 
          className="space-y-4"
        >
          <RoleSelector 
            value="artist" 
            label="Entrar como artista" 
            icon={<Music size={18} />} 
            features={artistFeatures}
            isFirst={true}
            isLast={false}
          />
          <RoleSelector 
            value="seeker" 
            label="Entrar como buscador" 
            icon={<Search size={18} />} 
            features={seekerFeatures}
            isFirst={false}
            isLast={true}
          />
        </RadioGroup>
      </div>
      
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
