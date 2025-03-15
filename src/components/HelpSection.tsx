import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
interface HelpSectionProps {
  className?: string;
}
const HelpSection = ({
  className
}: HelpSectionProps) => {
  const navigate = useNavigate();
  const handleHelpClick = () => {
    // Aquí podríamos navegar a una página de ayuda en el futuro
    navigate("/");
  };
  return <section className={cn("px-12 md:px-14 lg:px-16", className)}>
      <div className="py-16 bg-[#F5F1EB] rounded-[40px] px-32">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 md:mb-0">
            ¿Tienes dudas?
          </h2>
          <Button onClick={handleHelpClick} className="bg-[#D4DDFF] text-[#222845] text-sm font-bold hover:bg-[#EBEFFF]">
            Ir a Vyba help
          </Button>
        </div>
      </div>
    </section>;
};
export default HelpSection;