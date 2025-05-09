
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, FileText, Music, GraduationCap, FileArchive, Download } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';
import { PageTransition } from '@/components/ui/page-transition';

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
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0
  });
  const [elementSize, setElementSize] = useState({
    width: 0,
    height: 0
  });
  const [elementRef, setElementRef] = useState<HTMLDivElement | null>(null);
  
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
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (elementRef) {
      const rect = elementRef.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setElementSize({
        width: rect.width,
        height: rect.height
      });
    }
  };

  return (
    <PageTransition>
      <Navbar />
      <div className="bg-vyba-cream dark:bg-vyba-dark-bg flex items-center justify-center min-h-[90vh] px-6 md:px-10 lg:px-14 xl:px-16">
        <Card className="border-none shadow-none bg-secondary dark:bg-vyba-dark-bg dark:border-vyba-dark-secondary rounded-3xl overflow-hidden w-full py-16 mx-auto">
          <div className="max-w-3xl mx-auto px-6 flex flex-col items-center">
            <h1 className="text-4xl md:text-6xl font-black mb-4 text-center dark:text-white">
              Gracias por formar parte de VYBA
            </h1>
            <h2 className="text-4xl mb-8 text-center dark:text-gray-300">
              Artista #{artistNumber}
            </h2>
            
            <div 
              className="w-full bg-white dark:bg-vyba-dark-secondary rounded-[40px] p-6 mb-12 relative overflow-hidden" 
              onMouseEnter={() => setIsHovered(true)} 
              onMouseLeave={() => setIsHovered(false)} 
              onMouseMove={handleMouseMove} 
              ref={el => setElementRef(el)}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-gray-50 content-center dark:bg-vyba-dark-secondary/80 p-6 rounded-2xl transition-all duration-300">
                    <div className="flex gap-6 items-center justify-center">
                      <GraduationCap size={48} className="text-black dark:text-white" />
                      <h3 className="text-5xl font-black text-center text-black dark:text-white">
                        {artistInfo.artistName}
                      </h3>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-vyba-dark-secondary/80 p-4 rounded-2xl transition-all duration-300">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-black dark:text-white">Géneros:</p>
                      <p className="text-black dark:text-white">
                        {artistInfo.genres || "House, Reggaeton..."}
                      </p>
                    </div>
                  </div>
                  <div className="mt-8">
                    <span className="px-6 py-3 bg-gray-50 dark:bg-vyba-dark-secondary/80 rounded-full text-sm font-medium">
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
                    <Button onClick={handleDownloadDiploma} className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-black dark:bg-vyba-dark-secondary/80 dark:hover:bg-vyba-dark-secondary/60 dark:text-white">
                      <Download size={20} />
                      Descargar diploma
                    </Button>
                  </div>
                </div>
              </div>
              
              {isHovered && (
                <div 
                  style={{
                    '--x': `${mousePosition.x}px`,
                    '--y': `${mousePosition.y}px`
                  } as React.CSSProperties} 
                  className="absolute inset-0 backdrop-blur-sm flex items-center justify-center transition-all duration-300"
                >
                  <Button onClick={handleDownloadDiploma} className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2">
                    <Download size={20} />
                    Descargar diploma
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center w-full gap-4 items-center">
              <Button 
                variant="outline" 
                onClick={handleGoBack} 
                className="w-12 h-12 rounded-full flex items-center justify-center p-0 order-2 sm:order-1 border-none bg-white dark:bg-vyba-dark-secondary"
              >
                <ArrowLeft size={20} strokeWidth={3} />
              </Button>
              
              <Button onClick={handleFinalize} className="w-auto order-1 ">
                Finalizar
              </Button>
            </div>
            
            <p className="mt-10 text-sm text-gray-600 dark:text-gray-400">
              Ya tienes una cuenta? <Link to="/auth" className="font-medium text-primary-foreground">Iniciar Sesión</Link>
            </p>
          </div>
        </Card>
      </div>
    </PageTransition>
  );
};

export default ArtistThankYouPage;
