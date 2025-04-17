
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { useIsMobile } from '@/hooks/use-mobile';

interface CachePriceStepProps {
  onPriceRangeChange: (minPrice: string, maxPrice: string) => void;
  initialMinPrice?: string;
  initialMaxPrice?: string;
}

const CachePriceStep: React.FC<CachePriceStepProps> = ({
  onPriceRangeChange,
  initialMinPrice = '',
  initialMaxPrice = ''
}) => {
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const isMobile = useIsMobile();

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setMinPrice(value);
    onPriceRangeChange(value, maxPrice);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setMaxPrice(value);
    onPriceRangeChange(minPrice, value);
  };

  return (
    <div className="flex flex-col w-full px-6 sm:px-4 md:px-8">
      <div className="max-w-xl w-full text-center mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Define tu caché
        </h1>
        <p className="text-gray-500 mb-8">
          ¿Cuál es tu rango de precios? Puedes dar una cifra orientativa
        </p>

        <div className="flex flex-col items-center justify-center w-full mt-12">
          <div className="flex items-center justify-center w-full gap-2">
            <label htmlFor="min-price" className="text-black dark:text-white font-medium">
              Entre
            </label>
            <div className="w-full max-w-[200px]">
              <Input 
                id="min-price"
                type="text" 
                placeholder="0" 
                value={minPrice}
                onChange={handleMinPriceChange}
                className={`bg-[#F7F7F7] dark:bg-vyba-dark-secondary/30 text-center ${isMobile ? 'text-sm' : ''}`}
                aria-label="Precio mínimo"
              />
            </div>
            <label htmlFor="max-price" className="text-black dark:text-white font-medium">
              y
            </label>
            <div className="w-full max-w-[200px]">
              <Input 
                id="max-price"
                type="text" 
                placeholder="0" 
                value={maxPrice}
                onChange={handleMaxPriceChange}
                className={`bg-[#F7F7F7] dark:bg-vyba-dark-secondary/30 text-center ${isMobile ? 'text-sm' : ''}`}
                aria-label="Precio máximo"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CachePriceStep;
