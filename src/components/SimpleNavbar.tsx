
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SimpleNavbarProps {
  className?: string;
}

const SimpleNavbar = ({
  className
}: SimpleNavbarProps) => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/thank-you');
  };
  
  return (
    <div 
      className={cn(
        "w-full mx-auto px-6 md:px-10 lg:px-14 xl:px-16 flex items-center justify-between h-24",
        className
      )}
    >
      {/* Logo */}
      <Link to="/" className="text-3xl font-bold dark:text-white">
        VYBA
      </Link>

      {/* Botón primario */}
      <Button 
        onClick={handleGetStarted}
        className="text-sm"
      >
        Empezar
      </Button>
    </div>
  );
};

export default SimpleNavbar;
