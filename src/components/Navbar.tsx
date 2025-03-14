
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
      <div className="flex items-center space-x-7">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold"
        >
          VYBA
        </motion.h1>
        <div className="hidden md:flex items-center space-x-8">
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
                "px-6 py-3 rounded-full transition-all duration-200",
                isActive("/") 
                  ? "bg-vyba-blue/80 text-vyba-navy font-medium" 
                  : "text-black font-medium hover:bg-vyba-blue/50"
              )}
            >
              Inicio
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
                "px-6 py-3 rounded-full transition-all duration-200",
                isActive("/artistas") 
                  ? "bg-vyba-blue/80 text-vyba-navy font-medium" 
                  : "text-black font-medium hover:bg-vyba-blue/50"
              )}
            >
              Artistas
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
            <button className={cn(
              "px-6 py-3 rounded-full transition-all duration-200 text-black font-medium flex items-center hover:bg-vyba-blue/50"
            )}>
              Todos los artistas
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
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
            <button className={cn(
              "px-6 py-3 rounded-full transition-all duration-200 text-black font-medium flex items-center hover:bg-vyba-blue/50"
            )}>
              Todos los géneros
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
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
