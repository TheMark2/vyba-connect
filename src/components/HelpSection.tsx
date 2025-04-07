
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface HelpSectionProps {
  className?: string;
}

const HelpSection = ({
  className
}: HelpSectionProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const handleHelpClick = () => {
    // Aquí podríamos navegar a una página de ayuda en el futuro
    navigate("/");
  };
  
  return <section className={cn("", className)}>
      <div className={cn(
        "bg-[#F7F7F7] dark:bg-vyba-dark-secondary rounded-2xl md:rounded-3xl",
        isMobile ? "py-6 px-5" : "py-8 md:py-8 px-6 md:px-10"
      )}>
        <div className="flex flex-col items-center justify-center text-center gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="font-black text-3xl lg:text-4xl">
              ¿Tienes alguna duda?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Contacta con VYBA help
            </p>  
          </div>
          <Button 
            onClick={handleHelpClick} 
            className="">
            Contactar con VYBA help
          </Button>
        </div>
      </div>
    </section>;
};

export default HelpSection;
