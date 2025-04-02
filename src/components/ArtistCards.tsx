
import React, { useState } from 'react';

interface Artist {
  id: number;
  name: string;
}

const ArtistCards = () => {
  // Array de artistas 
  const artists = [
    { id: 1, name: "Artista 1" },
    { id: 2, name: "Artista 2" },
    { id: 3, name: "Artista 3" },
    { id: 4, name: "Artista 4" }
  ];

  // Estado para rastrear la tarjeta en hover
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Función para manejar el clic en una tarjeta
  const handleCardClick = (artistId: number) => {
    console.log(`Navegando al perfil del artista: ${artistId}`);
    // Aquí puedes implementar navegación o mostrar información detallada
  };

  // Estilos dinámicos para la disposición de las tarjetas
  const getCardStyles = (index: number, isHovered: boolean) => {
    // Rotaciones y posiciones base para cada tarjeta
    const baseStyles = [
      "rotate-[-15deg] translate-x-[-180px]", // Más a la izquierda
      "rotate-[10deg] translate-x-[-60px]",   // Ajuste de posición
      "rotate-[-8deg] translate-x-[60px]",    // Ajuste de posición
      "rotate-[15deg] translate-x-[180px]"    // Más a la derecha
    ];

    // Si está siendo hoverada, quita la rotación pero mantiene la posición
    if (isHovered) {
      // Extraemos solo la parte de translación, quitamos la rotación
      const positionOnly = baseStyles[index].split(' ').find(style => style.includes('translate'));
      return `${positionOnly} rotate-0 scale-110 z-10`;
    }
    
    // Si no está siendo hoverada, aplica los estilos base completos
    return baseStyles[index];
  };

  return (
    <div className="bg-gray-50 dark:bg-vyba-dark-secondary rounded-3xl p-8 w-full max-w-5xl mx-auto flex flex-col items-center">
      <h1 className="text-5xl font-bold text-center mb-16 dark:text-white">
        Descubre entre muchos artistas
      </h1>
      
      <div className="relative h-64 w-full max-w-4xl flex justify-center items-center">
        {artists.map((artist, index) => {
          const isHovered = hoveredCard === artist.id;
          
          return (
            <div 
              key={artist.id}
              onClick={() => handleCardClick(artist.id)}
              onMouseEnter={() => setHoveredCard(artist.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`
                absolute bg-gray-200 dark:bg-gray-700 rounded-3xl border-2 border-black dark:border-gray-600
                w-56 h-56 flex items-center justify-center
                transition-all duration-300 ease-in-out
                cursor-pointer
                ${getCardStyles(index, isHovered)}
              `}
              aria-label={`Ver perfil de ${artist.name}`}
            >
              <span className="text-lg font-medium dark:text-white">{artist.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ArtistCards;
