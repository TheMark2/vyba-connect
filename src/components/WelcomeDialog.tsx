import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface WelcomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userInfo: {
    fullName: string;
    email?: string;
  };
}

const WelcomeDialog = ({ open, onOpenChange, userInfo }: WelcomeDialogProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { userName } = useAuth();
  const [displayName, setDisplayName] = useState(userInfo.fullName);

  // Este efecto solo se ejecuta una vez al montar el componente
  useEffect(() => {
    console.log('WelcomeDialog se ha montado con estado open:', open);
    
    // Forzar un toast para verificar que el componente se está renderizando
    toast.info('¡Bienvenido a VYBA!', {
      description: 'Estamos muy contentos de tenerte con nosotros.',
      duration: 5000
    });

    // Verificar si el diálogo debería estar abierto
    if (!open) {
      console.log('WelcomeDialog debería estar abierto pero la prop open es false');
    }
  }, []);

  // Actualizar el nombre mostrado cuando cambie el nombre en el contexto
  useEffect(() => {
    console.log('WelcomeDialog useEffect [userName, userInfo]:', { userName, userInfo });
    if (userName && userName.trim() !== '') {
      setDisplayName(userName);
    } else if (userInfo.fullName && userInfo.fullName.trim() !== '') {
      setDisplayName(userInfo.fullName);
    } else {
      setDisplayName(userInfo.email?.split('@')[0] || 'Usuario');
    }
  }, [userName, userInfo]);

  const handlePromoteArtist = () => {
    navigate('/artist-benefits');
    onOpenChange(false);
  };

  const handleSearchArtists = () => {
    navigate('/artists');
    onOpenChange(false);
  };

  console.log('WelcomeDialog - Estado actual:', { open, displayName });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px] overflow-hidden">
        <button 
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 rounded-full p-2 hover:bg-gray-100 transition-colors"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="relative flex items-center justify-center h-[300px] mt-8 w-full">
          {/* Imagen izquierda (sobresale) */}
          <div className="h-full w-[30%] overflow-hidden rounded-3xl relative z-10 translate-x-[-7%]">
              <img
              src="/lovable-uploads/dogwithmale.png"
              alt="Vyba Artists"
              className="w-full h-full object-cover"
              />
          </div>

          {/* Imagen central (más grande) */}
          <div className="h-[110%] w-[40%] overflow-hidden rounded-3xl z-20">
              <img
              src="/lovable-uploads/girl1.png"
              alt="Vyba Artists"
              className="w-full h-full object-cover"
              />
          </div>

          {/* Imagen derecha (sobresale) */}
          <div className="h-full w-[30%] overflow-hidden rounded-3xl relative z-10 translate-x-[7%]">
              <img
              src="/lovable-uploads/girl2.png"
              alt="Vyba Artists"
              className="w-full h-full object-cover"
              />
          </div>
        </div>
        <DialogHeader>
          <DialogTitle className="text-center mt-12 mb-0">
            <div>
              <h1 className="text-5xl font-bold mb-4 dark:text-white px-8 max-w-3xl mx-auto">
                Te damos la bienvenida, {displayName}
              </h1>
              <p className="text-lg font-light mb-0 dark:text-white max-w-md mx-auto">Empieza a buscar a los mejores artistas musicales fácil y rápido</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center mt-6 max-w-xl mx-auto px-8 gap-6 mb-6">
          <Button variant="terciary" onClick={handleSearchArtists}>
            Empezar a buscar
          </Button>

          <Button variant="terciary" onClick={handlePromoteArtist}>
            Promocionarse como artista
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeDialog;
