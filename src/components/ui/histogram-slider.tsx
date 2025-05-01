import React, { useState, useEffect, useMemo } from 'react';
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface HistogramSliderProps {
  min: number;
  max: number;
  step?: number;
  defaultValue?: [number, number];
  onValueChange?: (value: [number, number]) => void;
  data?: number[];
  currency?: string;
  className?: string;
}

const HistogramSlider = ({
  min,
  max,
  step = 1,
  defaultValue = [min, max],
  onValueChange,
  data = [],
  currency = "€",
  className,
}: HistogramSliderProps) => {
  const [value, setValue] = useState<[number, number]>(defaultValue);
  
  // Usamos useMemo para datos del histograma que no necesitan actualizarse en cada render
  const { histogramData, maxBinValue } = useMemo(() => {
    // Si hay datos proporcionados, usamos esos
    const priceData = data.length > 0 
      ? data 
      : generateFakeData(min, max);
    
    return generateHistogram(priceData, min, max);
  }, [data, min, max]); // Solo se recalcula si cambian estas dependencias

  // Genera datos aleatorios de precios con una distribución bimodal
  function generateFakeData(min: number, max: number): number[] {
    const sampleSize = 100;
    return Array.from({ length: sampleSize }, () => {
      const r = Math.random();
      if (r < 0.6) {
        return Math.floor(min + (max - min) * 0.3 * Math.random());
      } else {
        return Math.floor(min + (max - min) * (0.6 + 0.4 * Math.random()));
      }
    });
  }

  // Genera el histograma a partir de los datos
  function generateHistogram(priceData: number[], min: number, max: number) {
    const numBins = 25;
    const binSize = (max - min) / numBins;
    
    // Inicializamos array de bins
    const bins = Array(numBins).fill(0);
    
    // Llenamos los bins con los datos
    priceData.forEach(price => {
      if (price >= min && price <= max) {
        const binIndex = Math.min(Math.floor((price - min) / binSize), numBins - 1);
        bins[binIndex]++;
      }
    });
    
    // Encontramos el valor máximo para normalizar
    const maxCount = Math.max(...bins);
    
    return {
      histogramData: bins,
      maxBinValue: maxCount
    };
  }

  const handleValueChange = (newValue: number[]) => {
    const typedValue: [number, number] = [newValue[0], newValue[1]];
    setValue(typedValue);
    onValueChange?.(typedValue);
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="relative h-16 mb-6">
        {/* Histograma */}
        <div className="absolute inset-0 flex items-end justify-between">
          {histogramData.map((count, i) => {
            const heightPercentage = maxBinValue ? (count / maxBinValue) * 100 : 0;
            const binValue = i * (max - min) / histogramData.length + min;
            const isSelected = binValue >= value[0] && binValue <= value[1];
            
            return (
              <div
                key={i}
                className={cn(
                  "w-full h-full mx-[0.5px] rounded-sm",
                  isSelected 
                    ? "bg-vyba-navy" 
                    : "bg-vyba-gray"
                )}
                style={{ 
                  height: `${heightPercentage}%`,
                  transition: "background-color 0.2s ease"
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Slider */}
      <Slider
        defaultValue={value}
        value={value}
        min={min}
        max={max}
        step={step}
        onValueChange={handleValueChange}
        className="py-4"
      />
      
      {/* Etiquetas de rango */}
      <div className="flex justify-between text-sm text-vyba-tertiary font-light">
        <span>{min}{currency}</span>
        <span className="font-medium text-black">
          {value[0]}{currency} - {value[1]}{currency}
        </span>
        <span>{max}{currency}+</span>
      </div>
    </div>
  );
};

export default HistogramSlider; 