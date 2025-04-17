
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, MapPin } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { FeaturedLocationDialog, Location } from './FeaturedLocationDialog';
import { motion, AnimatePresence } from 'framer-motion';

interface ExperienceStepProps {
  onInputChange: (experience: string) => void;
  initialValue?: string;
}

const ExperienceStep: React.FC<ExperienceStepProps> = ({
  onInputChange,
  initialValue = ''
}) => {
  const [experience, setExperience] = useState(initialValue);
  const [wordCount, setWordCount] = useState(initialValue ? initialValue.trim().split(/\s+/).filter(Boolean).length : 0);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleExperienceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newExperience = e.target.value;
    setExperience(newExperience);
    onInputChange(newExperience);
    setWordCount(newExperience.trim() ? newExperience.trim().split(/\s+/).filter(Boolean).length : 0);
  };

  const handleAddLocation = (location: Location) => {
    setLocations([...locations, location]);
  };

  const getWordCountColor = () => {
    if (wordCount >= 100) return "bg-green-100 text-green-600";
    if (wordCount >= 50) return "bg-blue-100 text-blue-600";
    return "bg-pink-100 text-pink-500";
  };

  return (
    <div className="content-container">
      <div className="form-container text-center">
        <h1 className="form-title text-gray-900 dark:text-white" id="experience-title">
          ¿Tienes experiencia?
        </h1>
        <p className="form-description">
          Explícanos tu experiencia y los lugares destacados donde has trabajado
        </p>
        
        <div className="bg-transparent rounded-3xl p-0 md:p-12 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full mx-auto"
          >
            <div className="space-y-4">
              <Textarea 
                placeholder="Es importante que el texto sea original. No se pueden insertar enlaces ni números de teléfono." 
                className={`min-h-[180px] transition-all duration-300 ${isMobile ? 'text-sm' : ''}`}
                value={experience} 
                onChange={handleExperienceChange}
                aria-label="Experiencia del artista" 
                aria-describedby="experience-description"
              />
              <div className="flex justify-end">
                <span className="text-sm text-gray-500">
                  Palabras escritas <span className={`rounded-full px-2 py-1 ml-1 transition-colors duration-300 ${getWordCountColor()}`}>{wordCount}</span>
                </span>
              </div>
              <p id="experience-description" className="sr-only">
                Describe tu experiencia como artista y los lugares donde has trabajado
              </p>
            </div>
            
            <div className="mt-8">
              <AnimatePresence>
                {locations.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
                  >
                    {locations.map((location, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="bg-[#F7F7F7] dark:bg-vyba-dark-secondary/30 rounded-2xl p-4 flex items-center gap-3"
                      >
                        <MapPin className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium text-black dark:text-white m-0">{location.venue}</p>
                          <p className="text-gray-500 text-sm m-0">{location.city}</p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-6 flex justify-center">
                <Button 
                  variant="secondary" 
                  className="flex items-center gap-2 transition-transform duration-200 hover:scale-105" 
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  Añadir lugares destacados
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <FeaturedLocationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddLocation={handleAddLocation}
      />
    </div>
  );
};

export default ExperienceStep;
