import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Music, Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { toast } from "sonner";
import { Link } from 'react-router-dom';
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
    const {
      name,
      value
    } = e.target;
    setArtistForm({
      ...artistForm,
      [name]: value
    });
  };
  const handleSeekerFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
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
      navigate('/');
    }, 1500);
  };
  const handleBack = () => {
    navigate(-1);
  };
  return <>
      <Navbar />
      <div className="bg-vyba-cream dark:bg-vyba-dark-bg flex items-center justify-center min-h-[90vh] px-6 md:px-10 lg:px-14 xl:px-16">
        <Card className="border-none shadow-none bg-secondary dark:bg-vyba-dark-bg dark:border-vyba-dark-secondary rounded-3xl overflow-hidden w-full py-16 mx-auto">
          <div className="max-w-2xl mx-auto px-12">
            <h1 className="text-6xl font-black mb-10 text-center dark:text-white">Rellena tu información</h1>
            
            <div className="flex justify-center mb-12">
              <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white dark:bg-vyba-dark-secondary">
                {role === 'artist' ? <>
                    <Music size={20} className="text-black dark:text-white" />
                    <span className="text-sm font-medium text-black dark:text-white">Registrado como Artista</span>
                  </> : <>
                    <Search size={20} className="text-black dark:text-white" />
                    <span className="text-sm font-medium text-black dark:text-white">Registrado como Buscador</span>
                  </>}
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {role === 'artist' ?
            // Formulario para artistas
            <>
                  <div className="space-y-1.5">
                    <label htmlFor="artistName" className="block text-sm font-medium dark:text-white">
                      Nombre de artista
                    </label>
                    <Input id="artistName" name="artistName" value={artistForm.artistName} onChange={handleArtistFormChange} placeholder="Escribe tu nombre artístico" className="rounded-xl h-12 bg-white dark:bg-white dark:text-black" required />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="mainGenres" className="block text-sm font-medium dark:text-white">
                        Géneros principales
                      </label>
                      <Input id="mainGenres" name="mainGenres" value={artistForm.mainGenres} onChange={handleArtistFormChange} placeholder="Ej: Rock, Pop, Jazz" className="rounded-xl h-12 bg-white dark:bg-white dark:text-black" required />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label htmlFor="artistType" className="block text-sm font-medium dark:text-white">
                        Tipo de artista
                      </label>
                      <Input id="artistType" name="artistType" value={artistForm.artistType} onChange={handleArtistFormChange} placeholder="Ej: Solista, Banda, DJ" className="rounded-xl h-12 bg-white dark:bg-white dark:text-black" required />
                    </div>
                  </div>
                </> :
            // Formulario para buscadores
            <>
                  <div className="space-y-1.5">
                    <label htmlFor="fullName" className="block text-sm font-medium dark:text-white">
                      Nombre completo
                    </label>
                    <Input id="fullName" name="fullName" value={seekerForm.fullName} onChange={handleSeekerFormChange} placeholder="Escribe tu nombre completo" className="rounded-xl h-12 bg-white dark:bg-white dark:text-black" required />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="musicalTastes" className="block text-sm font-medium dark:text-white">
                        Gustos musicales
                      </label>
                      <Input id="musicalTastes" name="musicalTastes" value={seekerForm.musicalTastes} onChange={handleSeekerFormChange} placeholder="Ej: Rock, Jazz, Clásica" className="rounded-xl h-12 bg-white dark:bg-white dark:text-black" required />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label htmlFor="mobile" className="block text-sm font-medium dark:text-white">
                        Móvil
                      </label>
                      <Input id="mobile" name="mobile" type="tel" value={seekerForm.mobile} onChange={handleSeekerFormChange} placeholder="Tu número de teléfono" className="rounded-xl h-12 bg-white dark:bg-white dark:text-black" required />
                    </div>
                  </div>
                </>}
              
              <div className="flex justify-center items-center gap-3 mt-12">
                <Button type="button" variant="outline" onClick={handleBack} className="rounded-full p-3 border-none bg-white dark:bg-vyba-dark-secondary">
                  <ArrowLeft size={20} strokeWidth={3} />
                </Button>
                <Button type="submit">
                  Siguiente
                </Button>
              </div>
              
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ya tienes una cuenta? <Link to="/auth" className="font-medium text-primary-foreground">Iniciar Sesión</Link>
                </p>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </>;
};
export default ProfileInfoPage;