import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface NavbarProps {
  className?: string;
}

const Navbar = ({ className }: NavbarProps) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={cn("mx-auto px-6 md:px-10 lg:px-14 xl:px-16 h-24 flex items-center justify-between", className)}>
      {/* Logo y enlaces alineados a la izquierda */}
      <div className="flex items-center space-x-8">
        {/* Logo */}
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold"
        >
          VYBA
        </motion.h1>

        {/* Enlaces de navegación */}
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className={cn(
              "px-4 py-2 rounded-md text-black font-medium transition-colors duration-200",
              isActive("/") || "hover:bg-[#F5F1EB]",
              isActive("/") && "bg-[#F5F1EB]"
            )}
          >
            Inicio
          </Link>

          <Link 
            to="/artistas" 
            className={cn(
              "px-4 py-2 rounded-md text-black font-medium transition-colors duration-200",
              isActive("/artistas") || "hover:bg-[#F5F1EB]",
              isActive("/artistas") && "bg-[#F5F1EB]"
            )}
          >
            Artistas
          </Link>

          <Link 
            to="/todos-artistas" 
            className={cn(
              "px-4 py-2 rounded-md text-black font-medium transition-colors duration-200",
              isActive("/todos-artistas") || "hover:bg-[#F5F1EB]",
              isActive("/todos-artistas") && "bg-[#F5F1EB]"
            )}
          >
            Todos los artistas
          </Link>

          <Link 
            to="/todos-generos" 
            className={cn(
              "px-4 py-2 rounded-md text-black font-medium transition-colors duration-200",
              isActive("/todos-generos") || "hover:bg-[#F5F1EB]",
              isActive("/todos-generos") && "bg-[#F5F1EB]"
            )}
          >
            Todos los géneros
          </Link>
        </div>
      </div>

      {/* Botón de Entrar/Registrarse */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Button className="text-base">
          Entrar/Registrarse
        </Button>
      </motion.div>
    </div>
  );
};

export default Navbar;