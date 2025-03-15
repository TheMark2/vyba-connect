import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
interface NavbarProps {
  className?: string;
}
const Navbar = ({
  className
}: NavbarProps) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
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

      {/* Botón de Entrar/Registrarse */}
      <Button className="text-sm">
        Entrar/Registrarse
      </Button>
    </div>;
};
export default Navbar;