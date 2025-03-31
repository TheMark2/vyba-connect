import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, FileText, Music, GraduationCap, FileArchive } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';
import { PageTransition } from '@/components/ui/page-transition';
import { motion } from 'framer-motion';

const ArtistThankYouPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const artistInfo = location.state?.artistInfo || {
    artistName: "DjMave",
    artistType: "DJ",
    genres: "House, Reggaeton..."
  };
  const [artistNumber, setArtistNumber] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    const randomArtistNumber = Math.floor(Math.random() * 100) + 1;
    setArtistNumber(randomArtistNumber);
  }, []);
  
  const handleFinalize = () => {
    navigate('/');
  };
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handleDownloadDiploma = () => {
    const blob = new Blob(['Diploma personalizado para ' + artistInfo.artistName], {
      type: 'text/plain'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diploma_vyba.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
      <div className="bg-vyba-cream dark:bg-vyba-dark-bg flex items-center justify-center min-h-[90vh] px-6 md:px-10 lg:px-14 xl:px-16">
        <Card className="border-none shadow-none bg-secondary dark:bg-vyba-dark-bg dark:border-vyba-dark-secondary rounded-3xl overflow-hidden w-full py-16 mx-auto">
          <motion.div 
            className="max-w-3xl mx-auto px-6 flex flex-col items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 variants={itemVariants} className="text-6xl font-black mb-4 text-center dark:text-white">
              Gracias por formar parte de VYBA
            </motion.h1>
            <motion.h2 variants={itemVariants} className="text-4xl mb-8 text-center dark:text-gray-300">
              Artista #{artistNumber}
            </motion.h2>
            
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-8 justify-center">
              <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white dark:bg-vyba-dark-secondary">
                <Music size={20} className="text-black dark:text-white" />
                <div className="flex flex-col">                    
                  <span className="text-xs dark:text-white">Registrado como</span>
                  <span className="text-sm font-bold dark:text-white">Artista</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white dark:bg-vyba-dark-secondary">
                <Music size={20} className="text-black dark:text-white" />
                <div className="flex flex-col">                    
                  <span className="text-xs dark:text-white">DJ</span>
                  <span className="text-sm font-bold dark:text-white">
                    {artistInfo.artistName}
                  </span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              variants={itemVariants}
              className="w-full bg-white dark:bg-vyba-dark-secondary rounded-[40px] p-6 mb-12 cursor-pointer transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]"
              onClick={handleDownloadDiploma}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-vyba-dark-secondary/80 p-6 rounded-2xl transition-all duration-300">
                    <div className="flex items-center justify-center mb-4">
                      <GraduationCap size={48} className="text-black dark:text-white mb-3" />
                      <h3 className="text-5xl font-bold text-center text-black dark:text-white">
                        {artistInfo.artistName}
                      </h3>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-vyba-dark-secondary/80 p-6 rounded-2xl transition-all duration-300">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-black dark:text-white">Géneros:</p>
                      <p className="text-black dark:text-white">
                        {artistInfo.genres || "House, Reggaeton..."}
                      </p>
                    </div>
                  </div>
                  <div className="pt-6 transition-all duration-300 flex justify-center">
                    <span className="px-4 py-2 bg-gray-50 dark:bg-vyba-dark-secondary/80 rounded-full text-sm font-medium">
                      {artistInfo.artistType || "DJ"}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-vyba-dark-secondary/80 p-6 rounded-2xl transition-all duration-300">
                    <h4 className="text-xl font-bold mb-2 text-black dark:text-white">
                      Agradecimiento
                    </h4>
                    <p className="text-sm dark:text-white">
                      De parte del equipo de VYBA queremos agradecerte con un diploma personalizado
                    </p>
                  </div>
                  <div className="flex justify-center items-center p-6">
                    <div className="flex items-center gap-2 text-black dark:text-white">
                      <FileArchive size={20} />
                      Descargar diploma
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center w-full gap-4 items-center">
              <Button 
                variant="outline" 
                onClick={handleGoBack} 
                className="w-12 h-12 rounded-full flex items-center justify-center p-0 order-2 sm:order-1 border-none bg-white dark:bg-vyba-dark-secondary"
              >
                <ArrowLeft size={20} strokeWidth={3} />
              </Button>
              
              <Button 
                onClick={handleFinalize} 
                className="w-full sm:w-auto order-1 sm:order-2 bg-blue-200 text-black hover:bg-blue-300 dark:bg-blue-200 dark:text-black dark:hover:bg-blue-300"
              >
                Finalizar
              </Button>
            </motion.div>
            
            <motion.p variants={itemVariants} className="mt-10 text-sm text-gray-600 dark:text-gray-400">
              Ya tienes una cuenta? <Link to="/auth" className="font-medium text-primary-foreground">Iniciar Sesión</Link>
            </motion.p>
          </motion.div>
        </Card>
      </div>
    </PageTransition>
  );
};

export default ArtistThankYouPage;
