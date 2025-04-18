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
  Rocket, 
  Infinity,
  Route,
  HeartPulse
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '@/components/Footer';

const LandingArtist = () => {
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
      word: "crecer",
      iconColor: "#222222"
    },
    { 
      Icon: Rocket,
      word: "ganar",
      iconColor: "#222222"
    },
    { 
      Icon: Globe2,
      word: "sonar",
      iconColor: "#222222"
    },
    { 
      Icon: Sparkles,
      word: "triunfar",
      iconColor: "#222222"
    },
    { 
      Icon: Headphones,
      word: "vibrar",
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

  const container = {
    hidden: { 
      opacity: 0,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
        staggerChildren: 0.05
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const child = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 250
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <nav className="fixed top-0 left-0 w-full bg-white/30 dark:bg-black z-50 backdrop-blur-xl">
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
      
      <div className="pt-48 flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-8xl font-semibold text-center">
          La plataforma <span className="bg-gradient-to-r from-[#9b87f5] to-[#6E59A5] text-transparent bg-clip-text">creada</span> para
        </h1>
        
        <div className="relative h-24 md:h-28 mt-4 md:mt-8">
          <AnimatePresence mode="wait">
            <motion.div 
              key={`container-${currentIndex}`}
              className="bg-gray-50 dark:bg-gray-900 rounded-full px-8 py-6 md:px-12 md:py-3 flex items-center gap-6 md:gap-8 absolute left-1/2 transform -translate-x-1/2"
              initial={{ 
                opacity: 0, 
                y: 30, 
                scale: 0.9 
              }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1 
              }}
              exit={{ 
                opacity: 0, 
                y: -30, 
                scale: 0.9 
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                duration: 0.5
              }}
            >
              <div className="w-10 h-10 md:w-16 md:h-16 relative flex items-center justify-center">
                {React.createElement(content[currentIndex].Icon, {
                  size: 62,
                  color: content[currentIndex].iconColor,
                  strokeWidth: 1.5,
                  className: "animate-scale-in"
                })}
              </div>
              
              <motion.div
                variants={container}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex"
              >
                {content[currentIndex].word.split("").map((letter, index) => (
                  <motion.span
                    key={index}
                    variants={child}
                    className="text-4xl md:text-6xl font-medium"
                  >
                    {letter}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      <div className="relative flex items-center justify-center h-[700px] mt-32 w-full">
        <div className="h-full w-[30%] overflow-hidden rounded-3xl relative z-10 translate-x-[-5%]">
            <img
            src="/lovable-uploads/image.png"
            alt="Vyba Artists"
            className="w-full h-full object-cover"
            />
        </div>

        <div className="h-[110%] w-[40%] overflow-hidden rounded-3xl z-20">
            <img
            src="/lovable-uploads/image1.png"
            alt="Vyba Artists"
            className="w-full h-full object-cover"
            />
        </div>

        <div className="h-full w-[30%] overflow-hidden rounded-3xl relative z-10 translate-x-[5%]">
            <img
            src="/lovable-uploads/image2.png"
            alt="Vyba Artists"
            className="w-full h-full object-cover"
            />
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center mt-24 max-w-2xl mx-auto">
        <h4 className="text-3xl font-medium text-center">Tan sencillo como abrirse una cuenta en 2 minutos y empezar a recibir mensajes</h4>
        <Button variant="secondary" className="mt-4 text-xl bg-[#222222] text-white font-light">Empezar ahora</Button>
      </div>
      
      <div className="flex flex-col items-center justify-center mt-24 max-w-7xl mx-auto">
        <h1 className="text-7xl font-bold text-center max-w-4xl">
            Promocionarte como artista es muy fácil
        </h1>
        <div className="flex justify-between w-full items-center mt-12">
            <div className="flex flex-col gap-4 items-center justify-center">
                <div className="flex gap-4 items center justify-center rounded-full bg-[#F7F7F7] px-8 py-4 text-xl">
                    <Infinity size={24} />
                    Haz cambios cuando necesites
                </div>
                <p className="text-center text-base max-w-xs font-light">Haz actualizaciones en tu perfil <span className="font-medium text-black">a cualquier hora</span></p>
            </div>
            <div className="flex flex-col gap-4 items-center justify-center">
                <div className="flex gap-4 items center justify-center rounded-full bg-[#F7F7F7] px-8 py-4 text-xl">
                    <Route size={24} />
                    Publica en pocos pasos
                </div>
                <p className="text-center text-base max-w-xs font-light">Publica tu perfil de artista <span className="font-medium text-black">totalmente gratis</span> en menos de 5 minutos</p>
            </div>
            <div className="flex flex-col gap-4 items-center justify-center">
                <div className="flex gap-4 items center justify-center rounded-full bg-[#F7F7F7] px-8 py-4 text-xl">
                    <HeartPulse size={24} />
                    Recibe ayuda cuando lo necesites
                </div>
                <p className="text-center text-base max-w-xs font-light">Si necesitas ayuda o ves que algo no esta funcionando correctamente no dudes en contactarnos</p>
            </div>
        </div>
      </div>
      
      <Footer className="mt-24"/>
    </div>
  );
};

export default LandingArtist;
