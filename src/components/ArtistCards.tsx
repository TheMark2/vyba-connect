import React, { useState } from 'react';
interface Artist {
  id: number;
  name: string;
  type: string;
  image: string;
}
const ArtistCards = () => {
  // Array de artistas con más información
  const artists = [{
    id: 1,
    name: "Antonia Pedragosa",
    type: "DJ",
    image: "/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png"
  }, {
    id: 2,
    name: "Carlos Martínez",
    type: "Banda",
    image: "/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png"
  }, {
    id: 3,
    name: "Laura González",
    type: "Solista",
    image: "/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png"
  }, {
    id: 4,
    name: "Miguel Torres",
    type: "Grupo",
    image: "/lovable-uploads/7e7c2282-785a-46fb-84b2-f7b14b762e64.png"
  }];

  // Estado para rastrear la tarjeta en hover
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Función para manejar el clic en una tarjeta
  const handleCardClick = (artistId: number) => {
    console.log(`Navegando al perfil del artista: ${artistId}`);
    // Aquí puedes implementar navegación o mostrar información detallada
  };

  // Estilos dinámicos para la disposición de las tarjetas
  const getCardStyles = (index: number, isHovered: boolean) => {
    // Posiciones base para cada tarjeta
    const basePositions = ["translate-x-[-180px]",
    // Más a la izquierda
    "translate-x-[-60px]",
    // Ajuste de posición
    "translate-x-[60px]",
    // Ajuste de posición
    "translate-x-[180px]" // Más a la derecha
    ];

    // Rotaciones para cada tarjeta (solo se aplican cuando no están en hover)
    const baseRotations = ["rotate-[-15deg]",
    // Rotación izquierda
    "rotate-[10deg]",
    // Rotación derecha
    "rotate-[-8deg]",
    // Rotación izquierda
    "rotate-[15deg]" // Rotación derecha
    ];

    // Si está siendo hoverada, elimina la rotación y ajusta la posición para mayor separación
    if (isHovered) {
      // Cuando está en hover, solo aplicamos la posición y aumentamos la escala
      return `${basePositions[index]} rotate-0 scale-110 z-10`;
    }

    // Si no está siendo hoverada pero hay otra tarjeta en hover, incrementamos la separación
    if (hoveredCard !== null) {
      // Alejamos más las tarjetas que no están en hover
      const awayPosition = ["translate-x-[-220px]",
      // Más alejado a la izquierda
      "translate-x-[-100px]",
      // Ajuste de posición
      "translate-x-[100px]",
      // Ajuste de posición
      "translate-x-[220px]" // Más alejado a la derecha
      ];
      return `${awayPosition[index]} ${baseRotations[index]}`;
    }

    // Si no hay ninguna tarjeta en hover, aplicamos los estilos base completos
    return `${basePositions[index]} ${baseRotations[index]}`;
  };

  // Obtener imagen mejorada para cada artista
  const getEnhancedImage = (index: number) => {
    // Arreglo de imágenes mejoradas
    const enhancedImages = ["/lovable-uploads/77591a97-10cd-4c8b-b768-5b17483c3d9f.png", "/lovable-uploads/64cabbe3-ce62-4190-830d-0e5defd31a1b.png", "/lovable-uploads/c89ee394-3c08-48f6-b69b-bddd81dffa8b.png", "/lovable-uploads/7e7c2282-785a-46fb-84b2-f7b14b762e64.png"];
    return enhancedImages[index % enhancedImages.length];
  };
  return <div className="bg-gray-50 dark:bg-vyba-dark-secondary rounded-3xl p-8 w-full max-w-5xl mx-auto flex flex-col items-center">
      <h1 className="text-5xl font-medium text-center mb-16 dark:text-white">
        Descubre entre muchos artistas
      </h1>
      
      <div className="relative h-64 w-full max-w-4xl flex justify-center items-center">
        {artists.map((artist, index) => {
        const isHovered = hoveredCard === artist.id;
        return <div key={artist.id} onClick={() => handleCardClick(artist.id)} onMouseEnter={() => setHoveredCard(artist.id)} onMouseLeave={() => setHoveredCard(null)} className={`
                absolute rounded-3xl border-6 border-white dark:border-white
                w-56 h-56 flex flex-col justify-end
                transition-all duration-300 ease-in-out
                cursor-pointer overflow-hidden
                shadow-[0_10px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_30px_rgba(0,0,0,0.2)]
                ${getCardStyles(index, isHovered)}
              `} aria-label={`Ver perfil de ${artist.name}`}>
              {/* Imagen de fondo con degradado y efecto blur */}
              <div className={`
                  absolute inset-0 bg-cover bg-center z-0 transition-all duration-300
                  ${isHovered ? '' : 'blur-[2px]'}
                `} style={{
            backgroundImage: `url(${getEnhancedImage(index)})`
          }} />
              
              {/* Degradado negro de abajo hacia arriba */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-1"></div>
              
              {/* Contenido de texto */}
              <div className="relative z-2 p-4 text-white">
                <h2 className="text-xl font-bold">{artist.name}</h2>
                <p className="text-sm">{artist.type}</p>
              </div>
            </div>;
      })}
      </div>
    </div>;
};
export default ArtistCards;