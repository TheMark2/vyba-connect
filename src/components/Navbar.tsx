
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
  
  // Animaciones para los enlaces
  const linkVariants = {
    initial: { y: -5, opacity: 0 },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.05 * i,
        duration: 0.3,
        ease: "easeOut"
      }
    }),
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className={cn("mx-auto px-6 md:px-10 lg:px-14 xl:px-16 h-24 flex items-center justify-between", className)}>
      <div className="flex items-center space-x-5">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold"
        >
          VYBA
        </motion.h1>
        <div className="hidden md:flex items-center space-x-4">
          <motion.div
            custom={0}
            variants={linkVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
          >
            <Link 
              to="/" 
              className={cn(
                "px-6 py-3 rounded-full transition-all duration-300 relative overflow-hidden z-10",
                isActive("/") 
                  ? "bg-secondary text-secondary-foreground font-medium" 
                  : "text-black font-medium hover:bg-secondary/70 hover:text-secondary-foreground group"
              )}
            >
              <span className="relative z-10">Inicio</span>
              {!isActive("/") && (
                <span className="absolute inset-0 bg-secondary/70 transform scale-x-0 origin-left transition-transform duration-300 -z-10 group-hover:scale-x-100"></span>
              )}
            </Link>
          </motion.div>
          
          <motion.div
            custom={1}
            variants={linkVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
          >
            <Link 
              to="/artistas" 
              className={cn(
                "px-6 py-3 rounded-full transition-all duration-300 relative overflow-hidden z-10",
                isActive("/artistas") 
                  ? "bg-secondary text-secondary-foreground font-medium" 
                  : "text-black font-medium hover:bg-secondary/70 hover:text-secondary-foreground group"
              )}
            >
              <span className="relative z-10">Artistas</span>
              {!isActive("/artistas") && (
                <span className="absolute inset-0 bg-secondary/70 transform scale-x-0 origin-left transition-transform duration-300 -z-10 group-hover:scale-x-100"></span>
              )}
            </Link>
          </motion.div>
          
          <motion.div 
            className="relative"
            custom={2}
            variants={linkVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
          >
            <button className="px-6 py-3 rounded-full transition-all duration-300 relative overflow-hidden z-10 text-black font-medium hover:text-secondary-foreground group flex items-center">
              <span className="relative z-10">Todos los artistas</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="ml-1 relative z-10">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
              <span className="absolute inset-0 bg-secondary/70 transform scale-x-0 origin-left transition-transform duration-300 -z-10 group-hover:scale-x-100"></span>
            </button>
          </motion.div>
          
          <motion.div 
            className="relative"
            custom={3}
            variants={linkVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
          >
            <button className="px-6 py-3 rounded-full transition-all duration-300 relative overflow-hidden z-10 text-black font-medium hover:text-secondary-foreground group flex items-center">
              <span className="relative z-10">Todos los géneros</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="ml-1 relative z-10">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
              <span className="absolute inset-0 bg-secondary/70 transform scale-x-0 origin-left transition-transform duration-300 -z-10 group-hover:scale-x-100"></span>
            </button>
          </motion.div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
          <Button className="text-base">
            Entrar/Registrarse
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Navbar;
