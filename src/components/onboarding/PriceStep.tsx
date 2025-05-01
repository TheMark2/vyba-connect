import React from 'react';
import EditablePrice from '@/components/editableprice';
import { Badge } from "@/components/ui/badge";
import { Gem } from 'lucide-react';
interface PriceStepProps {
  onPriceChange: (price: string) => void;
  initialValue?: string;
  artistType?: string;
}

const getAveragePrice = (artistType?: string) => {
  const prices = {
    'DJ': '400€ - 800€',
    'Cantante': '300€ - 600€',
    'Guitarrista': '250€ - 500€',
    'Pianista': '300€ - 600€',
    'Violinista': '250€ - 500€',
    'Trompetista': '250€ - 500€',
    'Baterista': '250€ - 500€',
    'Bajista': '250€ - 500€',
    'Saxofonista': '300€ - 600€'
  };
  
  return prices[artistType as keyof typeof prices] || '250€ - 600€';
};

const PriceStep: React.FC<PriceStepProps> = ({ onPriceChange, initialValue = '0', artistType }) => {
  const numericValue = parseInt(initialValue.replace(/\D/g, ''), 10) || 0;

  const handlePriceChange = (newValue: number) => {
    onPriceChange(String(newValue));
  };

  return (
    <div className="w-full h-[40vh] flex items-center justify-center">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <EditablePrice value={numericValue} currency="€" onChange={handlePriceChange} />
          <Badge variant="secondary" className="w-fit mx-auto px-4 py-2 text-sm bg-vyba-gray flex items-center gap-2 mt-20">
            <Gem className="text-vyba-navy w-5 h-5" />
            Precio medio: {getAveragePrice(artistType)}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default PriceStep;
