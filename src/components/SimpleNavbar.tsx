
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SimpleNavbarProps {
  className?: string;
}

const SimpleNavbar = ({
  className
}: SimpleNavbarProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const handleGetStarted = () => {
    navigate('/thank-you');
  };
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  return (
    <div 
      className={cn(
        "w-full mx-auto flex items-center justify-between",
        isMobile ? "px-4 py-4 h-16" : "px-6 md:px-10 lg:px-14 xl:px-16 h-24",
        className
      )}
    >
      {/* Logo */}
      <Link to="/" className={cn(
        "font-bold dark:text-white",
        isMobile ? "text-xl" : "text-3xl"
      )}>
        VYBA
      </Link>

      {/* Botones de acción */}
      <div className="flex items-center space-x-2 md:space-x-3">
        <Button 
          variant="secondary"
          size={isMobile ? "sm" : "icon"}
          onClick={handleGoBack}
          className="rounded-full"
        >
          <ArrowLeft className={cn(
            isMobile ? "h-4 w-4" : "h-5 w-5"
          )} />
        </Button>
        
        <Button 
          onClick={handleGetStarted}
          className={cn(
            "text-sm",
            isMobile ? "text-xs py-1 px-4" : ""
          )}
        >
          Empezar
        </Button>
      </div>
    </div>
  );
};

export default SimpleNavbar;
