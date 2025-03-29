
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: 10,
  },
};

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.3,
};

export function PageTransition({ children, className }: PageTransitionProps) {
  const [progress, setProgress] = useState(0);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Simular carga con incrementos graduales
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setProgress(oldProgress => {
          if (oldProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => setShowLoader(false), 200); // Ocultar la barra después de completar
            return 100;
          }
          const increment = Math.random() * 10;
          return Math.min(oldProgress + increment, 100);
        });
      }, 100);
      
      return () => clearInterval(interval);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showLoader && (
        <div className="fixed top-0 left-0 w-full z-50">
          <Progress value={progress} className="h-1 rounded-none bg-secondary" />
        </div>
      )}
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
        className={cn(className)}
      >
        {children}
      </motion.div>
    </>
  );
}
