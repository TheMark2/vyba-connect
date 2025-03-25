
import React, { useState } from "react";
import { Book, List, Clock, Badge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge as UIBadge } from "@/components/ui/badge";

interface DetailedInformationProps {
  artist: {
    experience?: string[];
    equipment?: string[];
    timeRequirements?: string[];
    education?: string[];
  };
}

const DetailedInformation = ({ artist }: DetailedInformationProps) => {
  const [showFullInfo, setShowFullInfo] = useState(false);

  return (
    <div className="mt-8 mb-12">
      <h2 className="text-3xl font-black mb-6">Más información</h2>
      
      <div className={`relative overflow-hidden transition-all duration-500 ease-in-out ${!showFullInfo ? "max-h-[400px]" : ""}`}>
        <div className="space-y-8">
          {/* Experiencia */}
          <div>
            <h3 className="text-xl font-bold mb-3 flex items-center">
              Experiencia
            </h3>
            <p className="mb-4">
              ¿Buscas añadir un toque de elegancia y encanto musical a tu próximo evento? ¡Estás en el lugar indicado!
              Soy Antonia Pedragosa, una apasionada DJ especializada en jazz, bossa nova y blues. ✨✨
            </p>
            <div className="flex gap-3 flex-wrap">
              {artist.experience?.map((exp, index) => {
                // Dividir la experiencia en nombre y ubicación (asumiendo formato "Nombre - Ubicación")
                const parts = exp.split(' - ');
                const name = parts[0];
                const location = parts.length > 1 ? parts[1] : '';
                return (
                  <UIBadge 
                    key={index} 
                    variant="outline" 
                    className="py-3 px-6 bg-white border-0 text-sm font-medium dark:bg-vyba-dark-secondary"
                  >
                    <span className="text-black dark:text-white">{name}</span>
                    {location && (
                      <>
                        <span className="mx-1 text-gray-500">·</span>
                        <span className="text-gray-500">{location}</span>
                      </>
                    )}
                  </UIBadge>
                );
              })}
            </div>
          </div>

          {/* Repertorio */}
          <div>
            <h3 className="text-xl font-bold mb-3 flex items-center">
              Repertorio
            </h3>
            <p className="mb-4">
              ¿Buscas añadir un toque de elegancia y encanto musical a tu próximo evento? ¡Estás en el lugar indicado!
              Soy Antonia Pedragosa, una apasionada DJ especializada en jazz, bossa nova y blues. ✨✨
            </p>
          </div>

          {/* Logística y equipamiento */}
          <div>
            <h3 className="text-xl font-bold mb-3 flex items-center">
              Logística y equipamiento
            </h3>
            <p className="mb-4">
              ¿Buscas añadir un toque de elegancia y encanto musical a tu próximo evento? ¡Estás en el lugar indicado!
              Soy Antonia Pedragosa, una apasionada DJ especializada en jazz, bossa nova y blues. ✨✨
            </p>
            <div className="flex gap-3 flex-wrap">
              {artist.equipment?.map((item, index) => (
                <UIBadge 
                  key={index} 
                  variant="outline" 
                  className="py-2 px-4 bg-white border-0 text-sm font-medium flex items-center gap-2 dark:bg-vyba-dark-secondary"
                >
                  <List className="w-4 h-4" />                              
                  {item}
                </UIBadge>
              ))}
            </div>
          </div>

          {/* Tiempos */}
          <div>
            <h3 className="text-xl font-bold mb-3 flex items-center">
              Tiempos
            </h3>
            <p className="mb-4">
              ¿Buscas añadir un toque de elegancia y encanto musical a tu próximo evento? ¡Estás en el lugar indicado!
              Soy Antonia Pedragosa, una apasionada DJ especializada en jazz, bossa nova y blues. ✨✨
            </p>
            <div className="flex gap-3 flex-wrap">
              {artist.timeRequirements?.map((req, index) => (
                <UIBadge 
                  key={index} 
                  variant="outline" 
                  className="py-2 px-4 bg-white border-0 text-sm font-medium flex items-center gap-2 dark:bg-vyba-dark-secondary"
                >
                  <Clock className="w-4 h-4" />
                  {req}
                </UIBadge>
              ))}
            </div>
          </div>

          {/* Formación */}
          <div>
            <h3 className="text-xl font-bold mb-3 flex items-center">
              <Badge className="mr-2 h-5 w-5" />
              Formación
            </h3>
            <p className="mb-4">
              ¿Buscas añadir un toque de elegancia y encanto musical a tu próximo evento? ¡Estás en el lugar indicado!
              Soy Antonia Pedragosa, una apasionada DJ especializada en jazz, bossa nova y blues. ✨✨
            </p>
            <div className="flex gap-3 flex-wrap">
              {artist.education?.map((edu, index) => (
                <UIBadge 
                  key={index} 
                  variant="outline" 
                  className="py-2 px-4 bg-white border-0 text-sm font-medium flex items-center gap-2 dark:bg-vyba-dark-secondary"
                >
                  <Book className="w-4 h-4" />
                  {edu}
                </UIBadge>
              ))}
            </div>
          </div>
        </div>
        
        {/* Gradient overlay for truncated content */}
        {!showFullInfo && (
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#FAF8F6] to-transparent dark:from-vyba-dark-bg pointer-events-none transition-opacity duration-500 ease-in-out" />
        )}
      </div>
      
      {/* Button to toggle full content */}
      <div className="flex justify-center mt-6">
        <Button 
          variant="secondary" 
          className="px-6 rounded-full" 
          onClick={() => setShowFullInfo(!showFullInfo)}
        >
          {showFullInfo ? "Ver menos" : "Ver toda la información"}
        </Button>
      </div>
    </div>
  );
};

export default DetailedInformation;
