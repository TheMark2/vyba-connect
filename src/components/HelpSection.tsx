
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface HelpSectionProps {
  className?: string;
}

const HelpSection = ({ className }: HelpSectionProps) => {
  const navigate = useNavigate();
  
  const handleHelpClick = () => {
    // Aquí podríamos navegar a una página de ayuda en el futuro
    navigate("/");
  };
  
  return (
    <section className={cn("py-10 md:py-12 lg:py-14 bg-[#F5F1EB]", className)}>
      <div className="container mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 md:mb-0">
            ¿Tienes dudas?
          </h2>
          <Button 
            onClick={handleHelpClick}
            className="bg-[#D4DDFF] text-[#222845] px-10 py-6 h-auto text-lg font-medium hover:bg-[#EBEFFF]"
          >
            Ir a Vyba help
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HelpSection;
