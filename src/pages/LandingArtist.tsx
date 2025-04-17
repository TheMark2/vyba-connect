import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Mic, Star, TrendingUp, Radio, Award, Music, Headphones } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ArtistBenefitsPage = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const content = [
    { 
      Icon: Mic, 
      color: "#222222",
      word: "vyba",
      description: "conecta"
    },
    { 
      Icon: Star, 
      color: "#222222",
      word: "crece",
      description: "brilla"
    },
    { 
      Icon: TrendingUp, 
      color: "#222222",
      word: "gana",
      description: "avanza"
    },
    { 
      Icon: Radio, 
      color: "#222222",
      word: "suena",
      description: "impacta"
    },
    { 
      Icon: Award, 
      color: "#222222",
      word: "triunfa",
      description: "destaca"
    },
    { 
      Icon: Music, 
      color: "#222222",
      word: "vyba",
      description: "inspira"
    },
    { 
      Icon: Headphones, 
      color: "#222222",
      word: "vibra",
      description: "conecta"
    }
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % content.length);
    }, 2500);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleGetStarted = () => {
    navigate('/artist-onboarding');
  };
  
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Navbar fixed */}
      <nav className="fixed top-0 left-0 w-full bg-white dark:bg-black z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Imagen más pequeña y clickeable */}
          <button onClick={() => navigate('/')} className="p-1">
            <img
              src="/lovable-uploads/logovybaartists.png"
              alt="Logo Vyba Artists"
              className="h-10 w-auto" // Tamaño reducido de la imagen
            />
          </button>
          <Button onClick={handleGetStarted}>Empezar ahora</Button>
        </div>
      </nav>
      
      {/* Offset para que no se solape el contenido */}
      <div className="pt-32 flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-7xl font-semibold text-center">
          Impulsa tu carrera con
        </h1>
        
        <div className="bg-gray-50 dark:bg-gray-900 rounded-full px-8 py-5 md:px-16 md:py-7 mt-8 flex items-center gap-6 md:gap-8">
          {/* Contenedor de iconos con animación */}
          <div className="relative w-10 h-10 md:w-16 md:h-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={`icon-${currentIndex}`}
                initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
                transition={{ 
                  duration: 0.6, 
                  ease: [0.16, 1, 0.3, 1], // Ease out expo
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {React.createElement(content[currentIndex].Icon, {
                  size: 62,
                  color: content[currentIndex].color,
                  strokeWidth: 2,
                  className: "drop-shadow-md"
                })}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Palabra animada */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.h1
                key={`word-${currentIndex}`}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ 
                  duration: 0.5, 
                  ease: [0.16, 1, 0.3, 1], 
                  type: "tween" 
                }}
                className="text-4xl md:text-7xl font-medium mb-0"
              >
                {content[currentIndex].word}
              </motion.h1>
            </AnimatePresence>
          </div>
        </div>
        
        {/* Descripción adicional animada */}
        <div className="h-12 mt-4 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={`desc-${currentIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.4, 
                delay: 0.2,
                ease: "easeOut" 
              }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light text-center"
            >
              {content[currentIndex].description}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ArtistBenefitsPage;