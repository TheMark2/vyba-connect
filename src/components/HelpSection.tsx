
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
  
  return (
    <section className={cn("", className)}>
      <div className="py-8 md:py-16 bg-[#F5F1EB] dark:bg-vyba-dark-secondary rounded-[20px] md:rounded-[40px] px-6 md:px-10">
        <div className="flex flex-col items-center justify-center text-center gap-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black">
            ¿Tienes alguna duda?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Contacta con VYBA help
          </p>
          <Button 
            onClick={handleHelpClick} 
            className="bg-[#D4DDFF] text-[#222845] text-sm font-bold hover:bg-[#EBEFFF] w-full md:w-auto max-w-xs"
          >
            Contactar con VYBA help
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HelpSection;
