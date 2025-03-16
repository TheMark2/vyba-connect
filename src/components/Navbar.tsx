
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import MobileMenu from "@/components/MobileMenu";

interface NavbarProps {
  className?: string;
}

const Navbar = ({
  className
}: NavbarProps) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const isMobile = useIsMobile();

  return <div className={cn("mx-auto px-6 md:px-10 lg:px-14 xl:px-16 h-24 flex items-center justify-between", className)}>
      {/* Logo y enlaces alineados a la izquierda */}
      <div className="flex items-center space-x-12">
        {/* Logo */}
        <h1 className="text-3xl font-bold">
          VYBA
        </h1>

        {/* Enlaces de navegación */}
        <div className="hidden md:flex items-center space-x-2">
          <Link to="/" className={cn("px-6 py-3 rounded-full text-black font-medium relative overflow-hidden transition-colors duration-300", isActive("/") ? "bg-[#F5F1EB]" : "hover:bg-[#F9F6F2]")}>
            Inicio
          </Link>

          <Link to="/artistas" className={cn("px-6 py-3 rounded-full text-black font-medium relative overflow-hidden transition-colors duration-300", isActive("/artistas") ? "bg-[#F5F1EB]" : "hover:bg-[#F9F6F2]")}>
            Artistas
          </Link>

          <Link to="/todos-artistas" className={cn("px-6 py-3 rounded-full text-black font-medium relative overflow-hidden transition-colors duration-300", isActive("/todos-artistas") ? "bg-[#F5F1EB]" : "hover:bg-[#F9F6F2]")}>
            Todos los artistas
          </Link>

          <Link to="/todos-generos" className={cn("px-6 py-3 rounded-full text-black font-medium relative overflow-hidden transition-colors duration-300", isActive("/todos-generos") ? "bg-[#F5F1EB]" : "hover:bg-[#F9F6F2]")}>
            Todos los géneros
          </Link>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex items-center space-x-3">
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <MobileMenu />
          </Sheet>
        ) : (
          <>
            <Button 
              variant="secondary" 
              className="text-sm hidden sm:flex bg-[#E7D3D3]"
            >
              Promocionarse como artista
            </Button>
            <Button className="text-sm">
              Entrar/Registrarse
            </Button>
          </>
        )}
      </div>
    </div>;
};
export default Navbar;
