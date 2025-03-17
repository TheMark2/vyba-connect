
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
    <section className={cn("px-6 md:px-14 lg:px-16", className)}>
      <div className="py-8 md:py-16 bg-[#F5F1EB] dark:bg-vyba-dark-secondary rounded-[20px] md:rounded-[40px] px-6 md:px-32">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-black text-center md:text-left">
            ¿Tienes dudas?
          </h2>
          <Button 
            onClick={handleHelpClick} 
            className="bg-[#D4DDFF] text-[#222845] text-sm font-bold hover:bg-[#EBEFFF] w-full md:w-auto"
          >
            Ir a Vyba help
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HelpSection;
