
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { PageTransition } from '@/components/ui/page-transition';
import { Music, Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { toast } from "sonner";
import { Link } from 'react-router-dom';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const ProfileInfoPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState<'artist' | 'seeker'>('artist');

  // Formulario para artistas
  const [artistForm, setArtistForm] = useState({
    artistName: '',
    mainGenres: '',
    artistType: ''
  });

  // Formulario para buscadores
  const [seekerForm, setSeekerForm] = useState({
    fullName: '',
    musicalTastes: '',
    mobile: ''
  });
  
  useEffect(() => {
    // Obtener el rol del state de la navegación o usar 'artist' por defecto
    const userRole = location.state?.role || 'artist';
    setRole(userRole);
  }, [location.state]);
  
  const handleArtistFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setArtistForm({
      ...artistForm,
      [name]: value
    });
  };
  
  const handleSeekerFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSeekerForm({
      ...seekerForm,
      [name]: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast.success("Información guardada correctamente", {
      description: "Tu perfil ha sido actualizado.",
      position: "bottom-center"
    });

    // En un caso real, aquí guardaríamos la información en una base de datos
    setTimeout(() => {
      if (role === 'artist') {
        navigate('/thank-you', {
          state: {
            artistInfo: artistForm
          }
        });
      } else {
        navigate('/seeker-thank-you', {
          state: {
            seekerInfo: seekerForm
          }
        });
      }
    }, 1500);
  };
  
  const handleRoleChange = (newRole: 'artist' | 'seeker') => {
    setRole(newRole);
  };
  
  return (
    <PageTransition>
      <Navbar />
      <div className="bg-vyba-cream dark:bg-vyba-dark-bg min-h-[90vh] px-6 py-16 md:px-10 lg:px-14 xl:px-16">
        <div className="max-w-2xl mx-auto">
          <Card className="border-none shadow-none bg-secondary dark:bg-vyba-dark-secondary/30 rounded-3xl overflow-hidden max-w-2xl mx-auto px-6 md:px-12 py-16">
            <h1 className="text-4xl md:text-6xl font-black mb-10 text-center dark:text-white">Rellena tu información</h1>
            
            <div className="flex justify-center mb-12">
              <RadioGroup 
                value={role} 
                onValueChange={(value) => handleRoleChange(value as 'artist' | 'seeker')} 
                className="flex gap-4"
              >
                <div className={`py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center gap-3 cursor-pointer ${role === 'artist' ? 'bg-white dark:bg-vyba-dark-secondary/30' : 'bg-white/90 dark:bg-vyba-dark-secondary/20 hover:bg-white dark:hover:bg-vyba-dark-secondary/25'}`}>
                  <Music size={20} className="text-black dark:text-white" />
                  <div className="flex flex-col">                    
                    <span className={`text-sm font-bold ${role === 'artist' ? 'text-black dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                      Artista
                    </span>
                  </div>
                  <RadioGroupItem value="artist" className="hidden" />
                </div>
                
                <div className={`py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center gap-3 cursor-pointer ${role === 'seeker' ? 'bg-white dark:bg-vyba-dark-secondary/30' : 'bg-white/90 dark:bg-vyba-dark-secondary/20 hover:bg-white dark:hover:bg-vyba-dark-secondary/25'}`}>
                  <Search size={20} className="text-black dark:text-white" />
                  <div className="flex flex-col">                    
                    <span className={`text-sm font-bold ${role === 'seeker' ? 'text-black dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                      Buscador
                    </span>
                  </div>
                  <RadioGroupItem value="seeker" className="hidden" />
                </div>
              </RadioGroup>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {role === 'artist' ? (
                <>
                  <div className="space-y-1.5">
                    <label htmlFor="artistName" className="block text-sm font-medium dark:text-white">
                      Nombre de artista
                    </label>
                    <Input 
                      id="artistName" 
                      name="artistName" 
                      value={artistForm.artistName} 
                      onChange={handleArtistFormChange} 
                      placeholder="Escribe tu nombre artístico" 
                      className="rounded-xl h-12 bg-white dark:bg-black dark:text-white" 
                      required 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="mainGenres" className="block text-sm font-medium dark:text-white">
                        Géneros principales
                      </label>
                      <Input 
                        id="mainGenres" 
                        name="mainGenres" 
                        value={artistForm.mainGenres} 
                        onChange={handleArtistFormChange} 
                        placeholder="Ej: Rock, Pop, Jazz" 
                        className="rounded-xl h-12 bg-white dark:bg-black dark:text-white" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label htmlFor="artistType" className="block text-sm font-medium dark:text-white">
                        Tipo de artista
                      </label>
                      <Input 
                        id="artistType" 
                        name="artistType" 
                        value={artistForm.artistType} 
                        onChange={handleArtistFormChange} 
                        placeholder="Ej: Solista, Banda, DJ" 
                        className="rounded-xl h-12 bg-white dark:bg-black dark:text-white" 
                        required 
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <label htmlFor="fullName" className="block text-sm font-medium dark:text-white">
                      Nombre completo
                    </label>
                    <Input 
                      id="fullName" 
                      name="fullName" 
                      value={seekerForm.fullName} 
                      onChange={handleSeekerFormChange} 
                      placeholder="Escribe tu nombre completo" 
                      className="rounded-xl h-12 bg-white dark:bg-black dark:text-white" 
                      required 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="musicalTastes" className="block text-sm font-medium dark:text-white">
                        Gustos musicales
                      </label>
                      <Input 
                        id="musicalTastes" 
                        name="musicalTastes" 
                        value={seekerForm.musicalTastes} 
                        onChange={handleSeekerFormChange} 
                        placeholder="Ej: Rock, Jazz, Clásica" 
                        className="rounded-xl h-12 bg-white dark:bg-black dark:text-white" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label htmlFor="mobile" className="block text-sm font-medium dark:text-white">
                        Móvil
                      </label>
                      <Input 
                        id="mobile" 
                        name="mobile" 
                        type="tel" 
                        value={seekerForm.mobile} 
                        onChange={handleSeekerFormChange} 
                        placeholder="Tu número de teléfono" 
                        className="rounded-xl h-12 bg-white dark:bg-black dark:text-white" 
                        required 
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div className="flex justify-center items-center mt-12">
                <Button type="submit" className="w-full">
                  Siguiente
                </Button>
              </div>
              
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ¿Ya tienes una cuenta? <Link to="/auth" className="font-medium text-primary hover:text-primary/80 dark:text-white dark:hover:text-white/80 transition-colors">Iniciar Sesión</Link>
                </p>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProfileInfoPage;
