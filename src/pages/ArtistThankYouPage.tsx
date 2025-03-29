import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, FileText, Music } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';
const ArtistThankYouPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const artistInfo = location.state?.artistInfo || {
    artistName: ""
  };
  const [artistNumber, setArtistNumber] = useState(0);
  useEffect(() => {
    // Simulamos obtener un número de artista aleatorio entre 1 y 100
    const randomArtistNumber = Math.floor(Math.random() * 100) + 1;
    setArtistNumber(randomArtistNumber);
  }, []);
  const handleFinalize = () => {
    navigate('/');
  };
  const handleGoBack = () => {
    navigate(-1); // Esto navega a la pantalla anterior
  };
  const handleDownloadDiploma = () => {
    // En una implementación real, esto descargaría un PDF
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
  return <>
      <Navbar />
      <div className="bg-vyba-cream dark:bg-vyba-dark-bg flex items-center justify-center min-h-[90vh] px-6 md:px-10 lg:px-14 xl:px-16">
        <Card className="border-none shadow-none bg-secondary dark:bg-vyba-dark-bg dark:border-vyba-dark-secondary rounded-3xl overflow-hidden w-full py-16 mx-auto">
          <div className="max-w-2xl mx-auto px-12 flex flex-col items-center">
            <h1 className="text-6xl font-black mb-4 text-center dark:text-white">Gracias por formar parte de VYBA</h1>
            <h2 className="text-4xl mb-12 text-center dark:text-gray-300">
              Artista #{artistNumber}
            </h2>
            
            <div className="flex gap-6 mb-12">
              <div className="flex items-center gap-6 px-6 py-2 rounded-full bg-white dark:bg-vyba-dark-secondary">
                <Music size={20} className="text-black dark:text-white" />
                <div className="flex flex-col">                    
                  <span className="text-xs dark:text-white">Registrado como</span>
                  <span className="text-sm font-bold dark:text-white">Artista</span>
                </div>
              </div>
              
              <div className="flex items-center gap-6 px-6 py-2 rounded-full bg-white dark:bg-vyba-dark-secondary">
                <Music size={20} className="text-black dark:text-white" />
                <div className="flex flex-col">                    
                  <span className="text-xs dark:text-white">Tipo</span>
                  <span className="text-sm font-bold dark:text-white">
                    {artistInfo.artistType || "DJ"}
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-center mb-10 text-lg dark:text-gray-200 text-base">
              Para mostrar el agradecimiento de todo el equipo de VYBA te hemos hecho un diploma personalizado
            </p>
            
            <Button onClick={handleDownloadDiploma} variant="outline" className="mb-16 border-none bg-white dark:bg-vyba-dark-secondary">
              <FileText className="mr-2" size={20} />
              Descargar diploma
            </Button>
            
            <div className="flex flex-col sm:flex-row justify-center w-full gap-4 items-center">
              <Button variant="outline" onClick={handleGoBack} className="w-full sm:w-auto order-2 sm:order-1 border-none bg-white dark:bg-vyba-dark-secondary">
                <ArrowLeft className="mr-2" size={20} strokeWidth={3} />
                Volver
              </Button>
              
              <Button onClick={handleFinalize} className="w-full sm:w-auto order-1 sm:order-2">
                Finalizar
              </Button>
            </div>
            
            <p className="mt-10 text-sm text-gray-600 dark:text-gray-400">
              Ya tienes una cuenta? <Link to="/auth" className="font-medium text-primary-foreground">Iniciar Sesión</Link>
            </p>
          </div>
        </Card>
      </div>
    </>;
};
export default ArtistThankYouPage;