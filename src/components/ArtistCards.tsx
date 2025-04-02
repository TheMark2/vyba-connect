
import React, { useState } from 'react';

interface Artist {
  id: number;
  name: string;
  type: string;
  image: string;
}

const ArtistCards = () => {
  // Array de artistas con tipo e imagen añadidos
  const artists = [
    { 
      id: 1, 
      name: "David Guetta", 
      type: "DJ / Productor",
      image: "/lovable-uploads/440a191c-d45b-4031-acbe-509e602e5d22.png"
    },
    { 
      id: 2, 
      name: "Adele", 
      type: "Cantante",
      image: "/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png"
    },
    { 
      id: 3, 
      name: "Ed Sheeran", 
      type: "Cantautor",
      image: "/lovable-uploads/672e18fa-dfe5-48bb-b838-4f7f26998dc3.png"
    },
    { 
      id: 4, 
      name: "Bad Bunny", 
      type: "Reggaeton",
      image: "/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png"
    }
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
    // Rotaciones y posiciones base para cada tarjeta con mayor separación
    const baseStyles = [
      "rotate-[-15deg] translate-x-[-220px]", // Más a la izquierda
      "rotate-[10deg] translate-x-[-75px]",   // Ajuste de posición
      "rotate-[-8deg] translate-x-[75px]",    // Ajuste de posición
      "rotate-[15deg] translate-x-[220px]"    // Más a la derecha
    ];

    // Si está siendo hoverada, quita la rotación pero mantiene la posición
    if (isHovered) {
      // Extraemos solo la parte de translación, quitamos la rotación
      const positionOnly = baseStyles[index].split(' ').find(style => style.includes('translate'));
      return `${positionOnly} rotate-0 scale-110 z-10`;
    }
    
    // Si no está siendo hoverada, ajustamos la posición según si hay otra tarjeta con hover
    if (hoveredCard !== null) {
      // Si hay una tarjeta con hover, alejamos las demás tarjetas según su posición relativa
      if (index < artists.findIndex(a => a.id === hoveredCard)) {
        // Si está a la izquierda de la tarjeta con hover, moverla más a la izquierda
        return baseStyles[index].replace('translate-x-', 'translate-x-[-') + '40px]';
      } else if (index > artists.findIndex(a => a.id === hoveredCard)) {
        // Si está a la derecha de la tarjeta con hover, moverla más a la derecha
        return baseStyles[index].replace('translate-x-', 'translate-x-[') + '40px]';
      }
    }
    
    // Si no hay ninguna tarjeta con hover, aplica los estilos base completos
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
                absolute rounded-3xl border-2 border-black dark:border-gray-600
                w-56 h-56 flex flex-col items-center justify-end
                transition-all duration-300 ease-in-out
                cursor-pointer overflow-hidden
                ${getCardStyles(index, isHovered)}
              `}
              aria-label={`Ver perfil de ${artist.name}`}
            >
              {/* Imagen de fondo con degradado */}
              <div 
                className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
                style={{ backgroundImage: `url(${artist.image})` }}
              >
                {/* Overlay con degradado negro desde abajo */}
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"
                />
              </div>
              
              {/* Contenido del artista (nombre y tipo) */}
              <div className="relative z-10 p-4 text-center w-full">
                <h3 className="text-lg font-bold text-white truncate">
                  {artist.name}
                </h3>
                <p className="text-sm text-gray-200 mt-1">
                  {artist.type}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ArtistCards;
