import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import HistogramSlider from "@/components/ui/histogram-slider";

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
}

interface FilterOptions {
  artistTypes?: string[];
  genres?: string[];
  priceRange?: [number, number];
  availability?: string;
  location?: string;
  sortBy?: string;
}

const FilterDialog = ({ 
  open, 
  onOpenChange, 
  onApplyFilters,
  initialFilters = {} 
}: FilterDialogProps) => {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const [activeTab, setActiveTab] = useState<'tipos' | 'precios' | 'generos' | 'otros'>('tipos');

  // Datos de ejemplo
  const artistTypes = [
    "DJ", "Cantante", "Guitarrista", "Bajista", "Baterista", 
    "Pianista", "Violinista", "Saxofonista", "Trompetista"
  ];
  
  const musicGenres = [
    "Rock", "Pop", "Electrónica", "Hip Hop", "Jazz", "Clásica", 
    "Reggaeton", "Latina", "R&B", "Indie", "Alternativa", "Metal", 
    "Folk", "Country", "Blues", "Funk", "Soul", "Disco"
  ];

  const availabilityOptions = [
    "Cualquier día", "Solo fines de semana", "Entre semana", "Eventos especiales"
  ];

  const sortOptions = [
    "Popularidad", "Precio: menor a mayor", "Precio: mayor a menor", "Mejor valorados"
  ];

  const handleArtistTypeChange = (type: string) => {
    setFilters(prev => {
      const types = prev.artistTypes || [];
      return {
        ...prev,
        artistTypes: types.includes(type) 
          ? types.filter(t => t !== type)
          : [...types, type]
      };
    });
  };

  const handleGenreChange = (genre: string) => {
    setFilters(prev => {
      const genres = prev.genres || [];
      return {
        ...prev,
        genres: genres.includes(genre) 
          ? genres.filter(g => g !== genre)
          : [...genres, genre]
      };
    });
  };

  const handlePriceChange = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      priceRange: [value[0], value[1]]
    }));
  };

  const handleAvailabilityChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      availability: value
    }));
  };

  const handleSortChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onOpenChange(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.artistTypes?.length) count += filters.artistTypes.length;
    if (filters.genres?.length) count += filters.genres.length;
    if (filters.priceRange) count += 1;
    if (filters.availability) count += 1;
    if (filters.location) count += 1;
    return count;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-center">Filtros</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2 justify-start border-b border-gray-200 w-full px-6">
          <button
            className={cn(
              "text-sm font-medium text-vyba-tertiary hover:text-vyba-navy rounded-full px-6 py-3 transition-all duration-300 ease-in-out hover:bg-vyba-gray",
              activeTab === 'tipos' && "relative text-vyba-navy after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-6 after:h-[2px] after:bg-vyba-navy after:rounded-full"
            )}
            onClick={() => setActiveTab('tipos')}
          >
            Tipos de artista
          </button>
          <button
            className={cn(
              "text-sm font-medium text-vyba-tertiary hover:text-vyba-navy rounded-full px-6 py-3 transition-all duration-300 ease-in-out hover:bg-vyba-gray",
              activeTab === 'generos' && "relative text-vyba-navy after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-6 after:h-[2px] after:bg-vyba-navy after:rounded-full"
            )}
            onClick={() => setActiveTab('generos')}
          >
            Géneros
          </button>
          <button
            className={cn(
              "text-sm font-medium text-vyba-tertiary hover:text-vyba-navy rounded-full px-6 py-3 transition-all duration-300 ease-in-out hover:bg-vyba-gray",
              activeTab === 'precios' && "relative text-vyba-navy after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-6 after:h-[2px] after:bg-vyba-navy after:rounded-full"
            )}
            onClick={() => setActiveTab('precios')}
          >
            Precios
          </button>
          <button
            className={cn(
              "text-sm font-medium text-vyba-tertiary hover:text-vyba-navy rounded-full px-6 py-3 transition-all duration-300 ease-in-out hover:bg-vyba-gray",
              activeTab === 'otros' && "relative text-vyba-navy after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-6 after:h-[2px] after:bg-vyba-navy after:rounded-full"
            )}
            onClick={() => setActiveTab('otros')}
          >
            Más filtros
          </button>
        </div>

        <ScrollArea className="flex-grow pr-6 -mr-6 px-6 mt-4">
          <div className="py-4 space-y-8">
            {activeTab === 'tipos' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {artistTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-4">
                      <Checkbox 
                        id={`type-${type}`} 
                        checked={(filters.artistTypes || []).includes(type)}
                        onCheckedChange={() => handleArtistTypeChange(type)}
                      />
                      <Label htmlFor={`type-${type}`} className="text-sm font-light cursor-pointer">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'generos' && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {musicGenres.map((genre) => (
                    <Badge 
                      key={genre}
                      variant="default"
                      className={`cursor-pointer px-6 py-3 font-light ${
                        (filters.genres || []).includes(genre) 
                          ? 'bg-vyba-navy text-white hover:bg-vyba-navy/80' 
                          : 'bg-vyba-gray hover:bg-vyba-gray/80'
                      }`}
                      onClick={() => handleGenreChange(genre)}
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'precios' && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium">
                      Encuentra artistas en tu rango de precio
                    </div>
                  </div>
                  <HistogramSlider 
                    min={0} 
                    max={2000} 
                    step={50}
                    defaultValue={filters.priceRange || [100, 1000]}
                    onValueChange={handlePriceChange}
                    currency="€"
                  />
                </div>
              </div>
            )}

            {activeTab === 'otros' && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="font-medium">Disponibilidad</h3>
                  <RadioGroup 
                    value={filters.availability || ""}
                    onValueChange={handleAvailabilityChange}
                  >
                    {availabilityOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`availability-${option}`} />
                        <Label htmlFor={`availability-${option}`} className="text-sm font-normal cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Ordenar por</h3>
                  <RadioGroup 
                    value={filters.sortBy || "Popularidad"}
                    onValueChange={handleSortChange}
                  >
                    {sortOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`sort-${option}`} />
                        <Label htmlFor={`sort-${option}`} className="text-sm font-normal cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="flex justify-between mt-4 gap-2 px-6">
          <Button 
            variant="secondary" 
            onClick={handleClearFilters}
            className="text-vyba-tertiary"
            disabled={getActiveFiltersCount() === 0}
          >
            Limpiar filtros
          </Button>
          <Button 
            variant="terciary" 
            onClick={handleApplyFilters}
          >
            Encontrar {getActiveFiltersCount() > 0 ? `${getActiveFiltersCount()} artistas` : 'artistas'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilterDialog; 