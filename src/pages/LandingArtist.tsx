
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Mic, 
  Star, 
  TrendingUp, 
  Radio, 
  Award, 
  Music2, 
  Headphones, 
  Sparkles, 
  Heart, 
  Globe2, 
  Rocket 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ArtistBenefitsPage = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const content = [
    { 
      Icon: Music2,
      word: "vyba",
      iconColor: "#222222"
    },
    { 
      Icon: Star,
      word: "crece",
      iconColor: "#222222"
    },
    { 
      Icon: Rocket,
      word: "gana",
      iconColor: "#222222"
    },
    { 
      Icon: Globe2,
      word: "suena",
      iconColor: "#222222"
    },
    { 
      Icon: Sparkles,
      word: "triunfa",
      iconColor: "#222222"
    },
    { 
      Icon: Heart,
      word: "vyba",
      iconColor: "#222222"
    },
    { 
      Icon: Headphones,
      word: "vibra",
      iconColor: "#222222"
    }
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % content.length);
    }, 3000);
    
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
          <button onClick={() => navigate('/')} className="p-1">
            <img
              src="/lovable-uploads/logovybaartists.png"
              alt="Logo Vyba Artists"
              className="h-10 w-auto"
            />
          </button>
          <Button onClick={handleGetStarted}>Empezar ahora</Button>
        </div>
      </nav>
      
      <div className="pt-32 flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-7xl font-semibold text-center">
          Impulsa tu carrera con
        </h1>
        
        <div className="bg-gray-50 dark:bg-gray-900 rounded-full px-8 py-5 md:px-16 md:py-7 mt-8 flex items-center gap-6 md:gap-8">
          {/* Icon Animation Container */}
          <div className="relative w-10 h-10 md:w-16 md:h-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={`icon-${currentIndex}`}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  y: 0,
                  transition: {
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1]
                  }
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.8, 
                  y: -20,
                  transition: {
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1]
                  }
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {React.createElement(content[currentIndex].Icon, {
                  size: 62,
                  color: content[currentIndex].iconColor,
                  strokeWidth: 1.5
                })}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Word Animation Container */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.h1
                key={`word-${currentIndex}`}
                initial={{ y: 40, opacity: 0 }}
                animate={{ 
                  y: 0, 
                  opacity: 1,
                  transition: {
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.1
                  }
                }}
                exit={{ 
                  y: -40, 
                  opacity: 0,
                  transition: {
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1]
                  }
                }}
                className="text-4xl md:text-7xl font-medium mb-0"
              >
                {content[currentIndex].word}
              </motion.h1>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistBenefitsPage;
