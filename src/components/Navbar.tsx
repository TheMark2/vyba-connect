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

  // Animación para el fondo del hover
  const hoverVariants = {
    initial: { scaleX: 0, originX: 0 },
    hover: { scaleX: 1, originX: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };

  return (
    <div className={cn("mx-auto px-6 md:px-10 lg:px-14 xl:px-16 h-24 flex items-center justify-between", className)}>
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
      <div className="hidden md:flex items-center space-x-10">
        <motion.div whileHover="hover" className="relative">
          <Link 
            to="/" 
            className={cn(
              "px-6 py-3 rounded-full text-black font-medium relative overflow-hidden"
            )}
          >
            <motion.span 
              variants={hoverVariants}
              initial="initial"
              className="absolute inset-0 bg-secondary z-0"
            />
            <span className="relative z-10">Inicio</span>
          </Link>
        </motion.div>

        <motion.div whileHover="hover" className="relative">
          <Link 
            to="/artistas" 
            className={cn(
              "px-6 py-3 rounded-full text-black font-medium relative overflow-hidden"
            )}
          >
            <motion.span 
              variants={hoverVariants}
              initial="initial"
              className="absolute inset-0 bg-secondary z-0"
            />
            <span className="relative z-10">Artistas</span>
          </Link>
        </motion.div>

        <motion.div whileHover="hover" className="relative">
          <Link 
            to="/generos" 
            className={cn(
              "px-6 py-3 rounded-full text-black font-medium relative overflow-hidden"
            )}
          >
            <motion.span 
              variants={hoverVariants}
              initial="initial"
              className="absolute inset-0 bg-secondary z-0"
            />
            <span className="relative z-10">Géneros</span>
          </Link>
        </motion.div>
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