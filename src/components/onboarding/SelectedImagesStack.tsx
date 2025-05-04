import React from 'react';
import { cn } from '@/lib/utils';

interface SelectedImagesStackProps {
  items: string[];
  category: 'genres' | 'artists';
  className?: string;
  maxVisible?: number;
  spacing?: number;
}

const SelectedImagesStack: React.FC<SelectedImagesStackProps> = ({
  items,
  category,
  className,
  maxVisible = 5,
  spacing = 14
}) => {
  const getRandomRotation = (index: number) => {
    const rotations = [-12, -8, -4, 4, 8, 12, -6, 6, -10, 10];
    return rotations[index % rotations.length];
  };

  const visibleItems = items.slice(0, maxVisible);
  const remainingCount = Math.max(0, items.length - maxVisible);

  return (
    <div className={cn("relative h-14 flex items-center", className)}>
      {visibleItems.length > 0 ? (
        <>
          {visibleItems.map((item, index) => (
            <div 
              key={item} 
              className="absolute"
              style={{
                left: `${index * spacing}px`,
                zIndex: index + 1,
                transform: `rotate(${getRandomRotation(index)}deg)`,
                transition: 'all 0.3s ease'
              }}
            >
              <div className="w-14 h-14 rounded-md overflow-hidden border-2 border-white shadow-md">
                <img 
                  src={`/images/${category}/${item.toLowerCase().replace(/ /g, '-')}.jpg`}
                  alt={item}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `/images/${category}/default.jpg`;
                  }}
                />
              </div>
            </div>
          ))}
          
          {remainingCount > 0 && (
            <div 
              className="absolute flex items-center justify-center bg-vyba-navy text-white w-14 h-14 rounded-md border-2 border-white shadow-md"
              style={{
                left: `${visibleItems.length * spacing}px`,
                zIndex: visibleItems.length + 1,
                transform: `rotate(${getRandomRotation(visibleItems.length)}deg)`,
              }}
            >
              <span className="font-medium">+{remainingCount}</span>
            </div>
          )}
        </>
      ) : (
        <span className="text-vyba-tertiary text-sm italic">Ninguno seleccionado</span>
      )}
    </div>
  );
};

export default SelectedImagesStack; 