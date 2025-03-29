
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { Loader } from "lucide-react";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  loadingDelay?: number;
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

export function PageTransition({ 
  children, 
  className, 
  loading = false, 
  loadingDelay = 800 
}: PageTransitionProps) {
  const [isLoading, setIsLoading] = useState(loading);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (loading) {
      setIsLoading(true);
    } else {
      // Add a small delay before hiding loader for better UX
      timer = setTimeout(() => {
        setIsLoading(false);
      }, loadingDelay);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loading, loadingDelay]);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      className={cn(className)}
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Loader className="w-12 h-12 animate-spin text-primary" />
          <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-300 animate-pulse">
            Cargando...
          </p>
        </div>
      ) : (
        children
      )}
    </motion.div>
  );
}
