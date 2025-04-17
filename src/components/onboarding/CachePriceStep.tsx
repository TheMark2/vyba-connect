
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
    <div className="content-container w-full max-w-6xl mx-auto">
      <div className="form-container">
        <h1 className="form-title text-gray-900 dark:text-white" id="cache-price-title">
          Define tu caché
        </h1>
        <p className="form-description">
          ¿Cuál es tu rango de precios? Puedes dar una cifra orientativa
        </p>

        <div className="center-xy w-full mt-12 max-w-2xl mx-auto">
          <div className="center-xy w-full gap-2 flex-wrap">
            <label htmlFor="min-price" className="text-gray-900 dark:text-white font-medium">
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
                aria-describedby="price-range-description"
              />
            </div>
            <label htmlFor="max-price" className="text-gray-900 dark:text-white font-medium">
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
          <p id="price-range-description" className="sr-only">
            Introduce tu rango de precios, desde un mínimo hasta un máximo
          </p>
        </div>
      </div>
    </div>
  );
};

export default CachePriceStep;
