
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Search, Music } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';
import { Marquee } from "@/components/ui/marquee";
import ArtistProfileCard from '@/components/ArtistProfileCard';
import { PageTransition } from '@/components/ui/page-transition';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const dummyArtists = [
  {
    id: "1",
    name: "David Guetta",
    type: "DJ",
    description: "DJ y productor de música electrónica",
    images: ["/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png"],
    rating: 4.9,
    priceRange: "1500€ - 2000€",
    isFavorite: false
  },
  {
    id: "2",
    name: "Alicia Keys",
    type: "Solista",
    description: "Cantante, compositora y pianista",
    images: ["/lovable-uploads/a3c6b43a-dd61-4889-ae77-cb1016e65371.png"],
    rating: 4.8,
    priceRange: "2500€ - 3000€",
    isFavorite: true
  },
  {
    id: "3",
    name: "Coldplay",
    type: "Banda",
    description: "Banda británica de pop rock",
    images: ["/lovable-uploads/7e7c2282-785a-46fb-84b2-f7b14b762e64.png"],
    rating: 4.7,
    priceRange: "3000€ - 5000€",
    isFavorite: false
  },
  {
    id: "4",
    name: "Marc Vendrell",
    type: "DJ",
    description: "House, Reggaeton, Urbano...",
    images: ["/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png"],
    rating: 4.5,
    priceRange: "800€ - 1200€",
    isFavorite: false
  },
  {
    id: "5",
    name: "Laura Pausini",
    type: "Solista",
    description: "Cantante y compositora italiana",
    images: ["/lovable-uploads/672e18fa-dfe5-48bb-b838-4f7f26998dc3.png"],
    rating: 4.6,
    priceRange: "2000€ - 2500€",
    isFavorite: false
  }
];

const SeekerThankYouPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const seekerInfo = location.state?.seekerInfo || {
    fullName: "",
    musicalTastes: ""
  };
  const [seekerNumber, setSeekerNumber] = useState(0);

  useEffect(() => {
    const randomSeekerNumber = Math.floor(Math.random() * 100) + 1;
    setSeekerNumber(randomSeekerNumber);
  }, []);

  const handleFinalize = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <PageTransition>
      <Navbar />
      <div className="bg-vyba-cream dark:bg-vyba-dark-bg flex items-center justify-center min-h-[90vh] px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16">
        <Card className={`
          border-none shadow-none bg-secondary dark:bg-vyba-dark-bg dark:border-vyba-dark-secondary 
          rounded-3xl overflow-hidden w-full mx-auto
          ${isMobile ? 
            'fixed top-0 left-0 right-0 bottom-0 h-screen rounded-none z-50 py-4 pt-16 overflow-y-auto' : 
            'py-8 sm:py-16'
          }
        `}>
          <motion.div 
            className="max-w-3xl mx-auto px-4 sm:px-6 md:px-12 flex flex-col items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              variants={itemVariants} 
              className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 text-center dark:text-white px-2"
            >
              Gracias por formar parte de VYBA
            </motion.h1>
            <motion.h2 
              variants={itemVariants} 
              className="text-xl sm:text-2xl mb-6 sm:mb-8 text-center dark:text-gray-300 px-2"
            >
              Empieza a buscar ahora mismo
            </motion.h2>
            
            <motion.div 
              variants={itemVariants} 
              className="flex flex-col sm:flex-row flex-wrap gap-4 mb-8 sm:mb-12 justify-center w-full px-2"
            >
              <div className="flex items-center gap-4 sm:gap-6 px-4 sm:px-6 py-2 rounded-full bg-white dark:bg-vyba-dark-secondary w-full sm:w-auto">
                <Search size={isMobile ? 16 : 20} className="text-black dark:text-white shrink-0" />
                <div className="flex flex-col">                    
                  <span className="text-xs dark:text-white">Registrado como</span>
                  <span className="text-sm font-bold dark:text-white">Buscador</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 sm:gap-6 px-4 sm:px-6 py-2 rounded-full bg-white dark:bg-vyba-dark-secondary w-full sm:w-auto">
                <Music size={isMobile ? 16 : 20} className="text-black dark:text-white shrink-0" />
                <div className="flex flex-col">                    
                  <span className="text-xs dark:text-white">Gustos musicales</span>
                  <span className="text-sm font-bold dark:text-white truncate max-w-[200px]">
                    {seekerInfo.musicalTastes || "House, Reggaeton, Urbano..."}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
          <motion.div 
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="w-full mb-8 sm:mb-16">
              <Marquee 
                pauseOnHover 
                className="py-4" 
                gap="1rem"
              >
                {dummyArtists.map(artist => (
                  <div key={artist.id} className="w-[240px] sm:w-[280px] flex-shrink-0">
                    <ArtistProfileCard 
                      name={artist.name}
                      type={artist.type}
                      description={artist.description}
                      images={artist.images}
                      rating={artist.rating}
                      priceRange={artist.priceRange}
                      isFavorite={artist.isFavorite}
                      onClick={() => navigate(`/artista/${artist.id}`)}
                    />
                  </div>
                ))}
              </Marquee>
            </div>
          </motion.div>
          <motion.div 
            className="max-w-3xl mx-auto px-4 sm:px-6 md:px-12 flex flex-col items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          > 
            <motion.div 
              variants={itemVariants} 
              className="flex flex-col sm:flex-row justify-center w-full gap-4 items-center px-4"
            >
              <Button 
                variant="outline" 
                onClick={handleGoBack} 
                className="w-full sm:w-auto order-2 sm:order-1 border-none bg-white dark:bg-vyba-dark-secondary"
              >
                <ArrowLeft className="mr-2" size={isMobile ? 16 : 20} strokeWidth={3} />
                Volver
              </Button>
              
              <Button 
                onClick={handleFinalize} 
                className="w-full sm:w-auto order-1 sm:order-2"
              >
                Finalizar
              </Button>
            </motion.div>
            
            <motion.p 
              variants={itemVariants} 
              className="mt-6 sm:mt-10 text-sm text-gray-600 dark:text-gray-400"
            >
              Ya tienes una cuenta? <Link to="/auth" className="font-medium text-primary-foreground">Iniciar Sesión</Link>
            </motion.p>
          </motion.div>
        </Card>
      </div>
    </PageTransition>
  );
};

export default SeekerThankYouPage;
