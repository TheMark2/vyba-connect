
import React from 'react';
import { Music, Search, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RoleSelector } from '@/components/ui/radio-group';
import { motion } from "framer-motion";
import { itemVariants } from './animation-variants';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  return (
    <motion.form variants={itemVariants} onSubmit={handleRegisterSubmit} className="space-y-8">
      <div className="overflow-hidden rounded-2xl">
        <RadioGroup 
          value={registerForm.role} 
          onValueChange={value => setRegisterForm({
            ...registerForm,
            role: value
          })} 
          className="space-y-0"
        >
          <RoleSelector 
            value="artist" 
            label="Entrar como artista" 
            icon={<Music size={20} />} 
            features={artistFeatures}
            isFirst={true}
            isLast={false}
            isMobile={isMobile}
          />
          <RoleSelector 
            value="seeker" 
            label="Entrar como buscador" 
            icon={<Search size={20} />} 
            features={seekerFeatures}
            isFirst={false}
            isLast={true}
            isMobile={isMobile}
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
    </motion.form>
  );
};

export default RegisterFormStep2;
