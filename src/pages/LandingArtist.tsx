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
      <nav className="fixed top-0 left-0 w-full bg-white/30 dark:bg-black z-50 backdrop-blur-xl px-4">
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
      
      <div className="pt-32 md:pt-48 flex flex-col items-center justify-center px-12">
        <h1 className="text-5xl md:text-7xl font-semibold text-center">
          La plataforma creada para
        </h1>
        
        <div className="relative h-24 md:h-28 mt-4 md:mt-8 mx-auto">
          <motion.div 
            className="bg-vyba-gray dark:bg-gray-900 rounded-full px-6 py-4 md:px-8 md:py-6 flex items-center gap-6 md:gap-8"
            layout
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.5
            }}
          >
            <div className="w-10 h-10 md:w-16 md:h-16 relative flex items-center justify-center">
              <AnimatePresence mode="wait">
                {React.createElement(content[currentIndex].Icon, {
                  size: 62,
                  color: content[currentIndex].iconColor,
                  strokeWidth: 1.5,
                  className: "animate-scale-in"
                })}
              </AnimatePresence>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
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
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
      
      <div className="relative flex items-center justify-center h-[450px] md:h-[550px] lg:h-[750px] mt-16 md:mt-32 w-full overflow-x-hidden">
        <div className="h-[90%] w-[20%] md:w-[30%] rounded-l-none overflow-hidden rounded-3xl relative z-10 translate-x-[-10%] md:translate-x-[-5%]">
            <img
            src="/lovable-uploads/image.png"
            alt="Vyba Artists"
            className="w-full h-full object-cover"
            />
        </div>

        <div className="h-[100%] w-[60%] md:w-[40%] overflow-hidden rounded-3xl z-20">
            <img
            src="/lovable-uploads/image1.png"
            alt="Vyba Artists"
            className="w-full h-full object-cover"
            />
        </div>

        <div className="h-[90%] w-[20%] md:w-[30%] rounded-r-none overflow-hidden rounded-3xl relative z-10 translate-x-[10%] md:translate-x-[5%]">
            <img
            src="/lovable-uploads/image2.png"
            alt="Vyba Artists"
            className="w-full h-full object-cover"
            />
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center mt-24 max-w-2xl mx-auto px-12">
        <h4 className="text-3xl font-medium text-center">Tan sencillo como abrirse una cuenta en 2 minutos y empezar a recibir mensajes</h4>
        <Button variant="terciary" onClick={handleGetStarted} className="mt-6 text-xl">Empezar ahora</Button>
      </div>
      
      <div className="flex flex-col items-center justify-center mt-24 max-w-7xl mx-auto px-12">
        <h1 className="text-5xl md:text-7xl font-semibold text-center max-w-4xl">
            Promocionarte como artista es muy fácil
        </h1>
        <div className="flex flex-col md:flex-row gap-4 justify-between w-full items-center mt-12">
            <div className="flex flex-col gap-4 items-center justify-center">
                <div className="flex gap-4 items center justify-center rounded-full bg-[#F7F7F7] px-8 py-4 text-base">
                    <Infinity size={24} />
                    Haz cambios 24/7
                </div>
                <p className="text-center text-sm lg:text-base max-w-xs font-light">Haz actualizaciones en tu perfil <span className="font-medium text-black">a cualquier hora</span></p>
            </div>
            <div className="flex flex-col gap-4 items-center justify-center">
                <div className="flex gap-4 items center justify-center rounded-full bg-[#F7F7F7] px-8 py-4 text-base">
                    <Route size={24} />
                    Publica en pocos pasos
                </div>
                <p className="text-center text-sm lg:text-base max-w-xs font-light">Publica tu perfil de artista <span className="font-medium text-black">totalmente gratis</span> en menos de 5 minutos</p>
            </div>
            <div className="flex flex-col gap-4 items-center justify-center">
                <div className="flex gap-4 items center justify-center rounded-full bg-[#F7F7F7] px-8 py-4 text-base">
                    <HeartPulse size={24} />
                    Recibe ayuda
                </div>
                <p className="text-center text-sm lg:text-base max-w-xs font-light">Si necesitas ayuda o ves que algo no esta funcionando correctamente no dudes en contactarnos</p>
            </div>
        </div>
      </div>
      
      <Footer className="mt-24"/>
    </div>
  );
};

export default LandingArtist;
