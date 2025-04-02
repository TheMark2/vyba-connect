import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
interface RegisterFormStep3Props {
  artistForm: {
    artistName: string;
    mainGenres: string;
    artistType: string;
  };
  setArtistForm: React.Dispatch<React.SetStateAction<{
    artistName: string;
    mainGenres: string;
    artistType: string;
  }>>;
  isLoading: boolean;
  handleRegisterSubmit: (e: React.FormEvent) => void;
  handleBackStep: () => void;
  switchToLogin: () => void;
}
const RegisterFormStep3: React.FC<RegisterFormStep3Props> = ({
  artistForm,
  setArtistForm,
  isLoading,
  handleRegisterSubmit,
  handleBackStep,
  switchToLogin
}) => {
  return <form onSubmit={handleRegisterSubmit} className="space-y-6">
      <h1 className="text-6xl font-black mb-8 text-center dark:text-white">
        Rellena tu información
      </h1>
      
      <div className="bg-white dark:bg-vyba-dark-secondary/30 rounded-full py-5 px-6 flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gray-100 dark:bg-vyba-dark-secondary/50 rounded-full flex items-center justify-center">
          <span className="text-2xl">
            🎵
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Registrado como
          </span>
          <span className="text-xl font-bold">
            Artista
          </span>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-1.5">
          <label htmlFor="artistName" className="block text-sm font-medium dark:text-white">
            Nombre de artista
          </label>
          <Input id="artistName" name="artistName" value={artistForm.artistName} onChange={e => setArtistForm({
          ...artistForm,
          artistName: e.target.value
        })} placeholder="Escribe tu nombre artístico" className="rounded-xl h-12 bg-white dark:bg-black dark:text-white" required />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="mainGenres" className="block text-sm font-medium dark:text-white">
              Géneros principales
            </label>
            <Input id="mainGenres" name="mainGenres" value={artistForm.mainGenres} onChange={e => setArtistForm({
            ...artistForm,
            mainGenres: e.target.value
          })} placeholder="Ej: Rock, Pop, Jazz" className="rounded-xl h-12 bg-white dark:bg-black dark:text-white" required />
          </div>
          
          <div className="space-y-1.5">
            <label htmlFor="artistType" className="block text-sm font-medium dark:text-white">
              Tipo de artista
            </label>
            <Input id="artistType" name="artistType" value={artistForm.artistType} onChange={e => setArtistForm({
            ...artistForm,
            artistType: e.target.value
          })} placeholder="Ej: Solista, Banda, DJ" className="rounded-xl h-12 bg-white dark:bg-black dark:text-white" required />
          </div>
        </div>
      </div>
      
      <div className="flex justify-center items-center gap-3 mt-8">
        <Button type="button" variant="secondary" onClick={handleBackStep} className="p-3 bg-white hover:bg-gray-100 dark:bg-white dark:hover:bg-gray-100 dark:text-black" disabled={isLoading}>
          <ArrowLeft size={20} />
        </Button>
        <Button type="submit" isLoading={isLoading} className="w-full">
          Siguiente
        </Button>
      </div>
      <div className="text-center mt-4 pt-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          ¿Tienes cuenta?
        </p>
        <Button variant="secondary" className="mt-2 text-xs font-bold" onClick={switchToLogin}>
          Iniciar Sesión
        </Button>
      </div>
    </form>;
};
export default RegisterFormStep3;