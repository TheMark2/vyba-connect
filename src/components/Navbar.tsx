
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

  // Animación para el fondo en movimiento
  const hoverBackgroundVariants = {
    initial: { scaleX: 0, originX: 0 }, // Inicia sin fondo visible
    hover: { scaleX: 1, originX: 0, transition: { duration: 0.3, ease: "easeOut" } }, // El fondo se expande al hacer hover
  };

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
          <motion.div whileHover="hover" className="relative">
            <Link 
              to="/" 
              className={cn(
                "px-6 py-3 rounded-full text-black font-medium relative overflow-hidden", // Padding ajustado
                isActive("/") && "font-bold"
              )}
            >
              {/* Fondo animado */}
              <motion.span 
                variants={hoverBackgroundVariants}
                initial="initial"
                whileHover="hover"
                className="absolute inset-0 bg-vyba-blue/30 z-0"
              />
              <span className="relative z-10">Inicio</span>
            </Link>
          </motion.div>

          <motion.div whileHover="hover" className="relative">
            <Link 
              to="/artistas" 
              className={cn(
                "px-6 py-3 rounded-full text-black font-medium relative overflow-hidden", // Padding ajustado
                isActive("/artistas") && "font-bold"
              )}
            >
              {/* Fondo animado */}
              <motion.span 
                variants={hoverBackgroundVariants}
                initial="initial"
                whileHover="hover"
                className="absolute inset-0 bg-vyba-blue/30 z-0"
              />
              <span className="relative z-10">Artistas</span>
            </Link>
          </motion.div>

          <motion.div whileHover="hover" className="relative">
            <Link 
              to="/todos-artistas" 
              className={cn(
                "px-6 py-3 rounded-full text-black font-medium relative overflow-hidden", // Padding ajustado
                isActive("/todos-artistas") && "font-bold"
              )}
            >
              {/* Fondo animado */}
              <motion.span 
                variants={hoverBackgroundVariants}
                initial="initial"
                whileHover="hover"
                className="absolute inset-0 bg-vyba-blue/30 z-0"
              />
              <span className="relative z-10">Todos los artistas</span>
            </Link>
          </motion.div>

          <motion.div whileHover="hover" className="relative">
            <Link 
              to="/todos-generos" 
              className={cn(
                "px-6 py-3 rounded-full text-black font-medium relative overflow-hidden", // Padding ajustado
                isActive("/todos-generos") && "font-bold"
              )}
            >
              {/* Fondo animado */}
              <motion.span 
                variants={hoverBackgroundVariants}
                initial="initial"
                whileHover="hover"
                className="absolute inset-0 bg-vyba-blue/30 z-0"
              />
              <span className="relative z-10">Todos los géneros</span>
            </Link>
          </motion.div>
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
